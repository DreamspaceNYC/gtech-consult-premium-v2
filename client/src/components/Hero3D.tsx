/**
 * Hero3D — interactive 3D product showcase for the G-Tech homepage hero.
 *
 * Renders three G-Tech products (solar panel, lithium battery, hybrid
 * inverter) as textured boxes on a soft studio floor, with a floating
 * logo plaque behind them. Hand-rolled drag-to-rotate turntable, idle
 * auto-rotation, click-to-focus camera and caption cards. No drei, no
 * OrbitControls — pointer drag is manual and wheel events are never
 * captured so page scroll keeps working.
 */
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { BatteryCharging, PlugZap, Sun, X } from "lucide-react";

type ProductId = "panel" | "battery" | "inverter";

interface ProductInfo {
  name: string;
  copy: string;
  Icon: typeof Sun;
  /** World position of the product centre (group origin at 0,0,0). */
  position: [number, number, number];
  size: [number, number, number];
  /** Offset added to the product position for the focused camera. */
  camOffset: [number, number, number];
}

const PRODUCTS: Record<ProductId, ProductInfo> = {
  panel: {
    name: "Solar panels",
    copy: "Solar panels — harvest sunlight and convert it into electricity.",
    Icon: Sun,
    position: [-2.05, 0.95, 0],
    size: [2.5, 1.6, 0.09],
    camOffset: [0, 0.55, 3.6],
  },
  battery: {
    name: "Lithium battery",
    copy: "Lithium battery — stores power for nighttime and cloudy days.",
    Icon: BatteryCharging,
    position: [-0.15, 0.975, 0],
    size: [0.9, 1.95, 0.55],
    camOffset: [0, 0.6, 3.6],
  },
  inverter: {
    name: "Hybrid inverter",
    copy: "Hybrid inverter — converts stored power into clean AC for your home and office.",
    Icon: PlugZap,
    position: [1.75, 0.65, 0],
    size: [0.95, 1.3, 0.38],
    camOffset: [0, 0.65, 3.4],
  },
};

const DEFAULT_CAM_POS: [number, number, number] = [0, 2.3, 9];
const DEFAULT_CAM_TARGET: [number, number, number] = [0, 1.05, 0];
const DEFAULT_FOV = 38;
/**
 * Mobile framing (viewport <= 768px): the camera moves in close so the
 * product trio fills a portrait phone canvas instead of rendering tiny
 * inside a wide, mostly-empty frame. Desktop framing is untouched.
 */
const MOBILE_CAM_POS: [number, number, number] = [0, 1.7, 4.6];
const MOBILE_CAM_TARGET: [number, number, number] = [0, 1.0, 0];
const MOBILE_FOV = 42;
const LOGO_BASE_Y = 3.55;
/** Lowered on mobile so the logo plaque stays fully in frame above the products. */
const LOGO_BASE_Y_MOBILE = 2.35;
const IDLE_RESUME_MS = 3000;
const DRAG_PX = 0.008; // radians per pixel of horizontal drag
const CLICK_SLOP_PX = 8;

/** True when the viewport is phone-narrow; drives the closer mobile camera. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function useProductTextures() {
  const [panelTex, batteryTex, inverterTex, logoTex] = useLoader(THREE.TextureLoader, [
    "/images/hero3d/solar-panel-1.png",
    "/images/hero3d/battery-1.png",
    "/images/hero3d/inverter-1.png",
    "/images/hero3d/gtech-logo.png",
  ]);
  return { panelTex, batteryTex, inverterTex, logoTex };
}

/** Face materials for a product box: textured on the two large (±z) faces, plain edges. */
function useFaceMaterials(face: THREE.Texture, edgeColor: string): THREE.Material[] {
  const mats = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: edgeColor,
      roughness: 0.55,
      metalness: 0.35,
    });
    const faceMat = new THREE.MeshStandardMaterial({
      map: face,
      roughness: 0.45,
      metalness: 0.15,
    });
    // Box face order: +x, -x, +y, -y, +z, -z
    return [edge, edge, edge, edge, faceMat, faceMat];
  }, [face, edgeColor]);

  useEffect(() => {
    return () => {
      mats.forEach((m) => m.dispose());
    };
  }, [mats]);

  return mats;
}

/** Hand-rolled radial-gradient "shadow catcher" texture (no drei ContactShadows). */
function useRadialShadowTexture(): THREE.CanvasTexture {
  const tex = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(2,6,16,0.55)");
      g.addColorStop(0.55, "rgba(2,6,16,0.26)");
      g.addColorStop(1, "rgba(2,6,16,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    return () => {
      tex.dispose();
    };
  }, [tex]);

  return tex;
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
      />
      {/* Cool rim fill from behind-left */}
      <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#9db8ff" />
      {/* Warm front fill */}
      <pointLight position={[0, 1.5, 6]} intensity={12} color="#fff1dd" distance={20} />
    </>
  );
}

function StudioFloor() {
  const radialTex = useRadialShadowTexture();
  return (
    <>
      {/* Real shadow catcher */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
      {/* Soft radial gradient blob for the studio look */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
        <planeGeometry args={[15, 11]} />
        <meshBasicMaterial map={radialTex} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

function LogoPlaque({ texture, reducedMotion }: { texture: THREE.Texture; reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const isMobile = useIsMobile();
  const baseY = isMobile ? LOGO_BASE_Y_MOBILE : LOGO_BASE_Y;

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <mesh ref={ref} position={[0.2, baseY, -2.3]}>
      <planeGeometry args={[2.0, 1.64]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

interface ProductProps {
  id: ProductId;
  materials: THREE.Material[];
  onSelect: (id: ProductId) => void;
  wasDragged: () => boolean;
}

function Product({ id, materials, onSelect, wasDragged }: ProductProps) {
  const info = PRODUCTS[id];
  return (
    <mesh
      position={info.position}
      material={materials}
      castShadow
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (wasDragged()) return; // it was a drag, not a tap
        onSelect(id);
      }}
    >
      <boxGeometry args={info.size} />
    </mesh>
  );
}

interface TurntableProps {
  groupRef: React.RefObject<THREE.Group | null>;
  children: React.ReactNode;
}

function Turntable({ groupRef, children }: TurntableProps) {
  return <group ref={groupRef}>{children}</group>;
}

interface RigProps {
  groupRef: React.RefObject<THREE.Group | null>;
  dragRef: React.RefObject<{ dragging: boolean }>;
  selectedRef: React.RefObject<ProductId | null>;
  lastInteractionRef: React.RefObject<number>;
  reducedMotion: boolean;
}

/** Camera focus spring: lerps position + lookAt target toward the focused product. */
function CameraRig({ selectedRef }: Pick<RigProps, "selectedRef">) {
  const isMobile = useIsMobile();
  const homePos = isMobile ? MOBILE_CAM_POS : DEFAULT_CAM_POS;
  const homeTarget = isMobile ? MOBILE_CAM_TARGET : DEFAULT_CAM_TARGET;
  const target = useRef(new THREE.Vector3(...homeTarget));
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const cam = state.camera;
    const sel = selectedRef.current;
    if (sel) {
      const p = PRODUCTS[sel];
      desiredPos.set(p.position[0] + p.camOffset[0], p.position[1] + p.camOffset[1], p.position[2] + p.camOffset[2]);
      desiredTarget.set(p.position[0], p.position[1], p.position[2]);
    } else {
      desiredPos.set(...homePos);
      desiredTarget.set(...homeTarget);
    }
    const k = 1 - Math.exp(-5 * delta);
    cam.position.lerp(desiredPos, k);
    target.current.lerp(desiredTarget, k);
    cam.lookAt(target.current);
  });

  return null;
}

/** Idle auto-rotation of the turntable; pauses on interaction, resumes after 3s idle. */
function AutoRotate({ groupRef, dragRef, selectedRef, lastInteractionRef, reducedMotion }: RigProps) {
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g || reducedMotion) return;
    if (selectedRef.current) return; // locked while a product is focused
    if (dragRef.current.dragging) return;
    if (performance.now() - lastInteractionRef.current < IDLE_RESUME_MS) return;
    g.rotation.y += delta * 0.22;
  });
  return null;
}

function Scene({
  groupRef,
  dragRef,
  selectedRef,
  lastInteractionRef,
  reducedMotion,
  onSelect,
  wasDragged,
}: RigProps & {
  onSelect: (id: ProductId) => void;
  wasDragged: () => boolean;
}) {
  const { panelTex, batteryTex, inverterTex, logoTex } = useProductTextures();

  useEffect(() => {
    for (const t of [panelTex, batteryTex, inverterTex, logoTex]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
  }, [panelTex, batteryTex, inverterTex, logoTex]);

  const panelMats = useFaceMaterials(panelTex, "#0b1526");
  const batteryMats = useFaceMaterials(batteryTex, "#d7dbe2");
  const inverterMats = useFaceMaterials(inverterTex, "#2a2f38");

  return (
    <>
      <StudioLights />
      <StudioFloor />
      <LogoPlaque texture={logoTex} reducedMotion={reducedMotion} />
      <Turntable groupRef={groupRef}>
        <Product id="panel" materials={panelMats} onSelect={onSelect} wasDragged={wasDragged} />
        <Product id="battery" materials={batteryMats} onSelect={onSelect} wasDragged={wasDragged} />
        <Product id="inverter" materials={inverterMats} onSelect={onSelect} wasDragged={wasDragged} />
      </Turntable>
      <CameraRig selectedRef={selectedRef} />
      <AutoRotate
        groupRef={groupRef}
        dragRef={dragRef}
        selectedRef={selectedRef}
        lastInteractionRef={lastInteractionRef}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export default function Hero3D() {
  const [selected, setSelected] = useState<ProductId | null>(null);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const isMobile = useIsMobile();

  const groupRef = useRef<THREE.Group | null>(null);
  const dragRef = useRef({ dragging: false, startX: 0, startRot: 0, moved: 0 });
  const selectedRef = useRef<ProductId | null>(null);
  const lastInteractionRef = useRef(0);

  const select = useCallback((id: ProductId | null) => {
    selectedRef.current = id;
    setSelected(id);
    if (id) {
      setInteracted(true);
      lastInteractionRef.current = performance.now();
    }
  }, []);

  const wasDragged = useCallback(() => dragRef.current.moved > CLICK_SLOP_PX, []);

  // Hand-rolled drag-to-rotate: pointerdown starts on the turntable (raycast),
  // moves are tracked on window so fast drags never lose the gesture.
  // Wheel events are never captured — page scroll keeps working.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.dragging) return;
      const g = groupRef.current;
      const dx = e.clientX - d.startX;
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (g) g.rotation.y = d.startRot + dx * DRAG_PX;
      lastInteractionRef.current = performance.now();
    };
    const onUp = () => {
      if (dragRef.current.dragging) {
        dragRef.current.dragging = false;
        setDragging(false);
        lastInteractionRef.current = performance.now();
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (selectedRef.current) return; // turntable locked while focused
      dragRef.current = {
        dragging: true,
        startX: e.clientX,
        startRot: groupRef.current?.rotation.y ?? 0,
        moved: 0,
      };
      setDragging(true);
      setInteracted(true);
      lastInteractionRef.current = performance.now();
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (selectedRef.current) return; // locked while focused; Escape resets
        e.preventDefault();
        const g = groupRef.current;
        if (g) g.rotation.y += e.key === "ArrowLeft" ? 0.18 : -0.18;
        setInteracted(true);
        lastInteractionRef.current = performance.now();
      } else if (e.key === "Escape") {
        select(null);
      }
    },
    [select],
  );

  const info = selected ? PRODUCTS[selected] : null;
  const Icon = info?.Icon;

  return (
    <div
      // Explicit heights (mirroring Hero3DSection) so the canvas size is
      // deterministic: percentage heights against the section's min-height
      // left the WebGL canvas undersized on some mobile browsers.
      className="relative h-[300px] w-full sm:h-[340px] lg:h-[70vh]"
      role="region"
      aria-label="Interactive 3D product showcase. Drag or use left and right arrow keys to rotate. Click a product to focus it."
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y", userSelect: "none" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        shadows
        camera={{
          position: isMobile ? MOBILE_CAM_POS : DEFAULT_CAM_POS,
          fov: isMobile ? MOBILE_FOV : DEFAULT_FOV,
          near: 0.1,
          far: 60,
        }}
        onPointerMissed={() => select(null)}
        style={{ touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          {/* Invisible hit-target so drags can start anywhere on the turntable */}
          <group
            onPointerDown={handlePointerDown}
            position={[0, 0, 0]}
          >
            <Scene
              groupRef={groupRef}
              dragRef={dragRef}
              selectedRef={selectedRef}
              lastInteractionRef={lastInteractionRef}
              reducedMotion={reducedMotion}
              onSelect={select}
              wasDragged={wasDragged}
            />
          </group>
        </Suspense>
      </Canvas>

      {/* Interaction hint */}
      {!interacted && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2">
          <p className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-1.5 text-xs text-slate-300 backdrop-blur">
            Drag to rotate — tap a product to focus
          </p>
        </div>
      )}

      {/* Caption card */}
      <AnimatePresence>
        {info && Icon && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-4 left-1/2 z-10 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 shadow-2xl backdrop-blur">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                <Icon size={20} aria-hidden />
              </span>
              <p className="flex-1 pt-1 text-sm leading-relaxed text-slate-100">{info.copy}</p>
              <button
                type="button"
                onClick={() => select(null)}
                aria-label="Close product details"
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} aria-hidden />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
