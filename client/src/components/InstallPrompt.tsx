import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

/**
 * "Install the app" banner (PWA).
 * - Android / desktop Chrome: uses the beforeinstallprompt event for one-tap install.
 * - iPhone / iPad: iOS has no install event, so we show the manual steps
 *   (Share -> Add to Home Screen) once, dismissible.
 * Never shows when already installed or after the user dismisses it.
 */
const DISMISS_KEY = "gtech-pwa-dismissed";

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  // iPadOS 13+ reports as MacIntel with touch support.
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const displayMode =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  return !!displayMode || iosStandalone;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<Event | null>(null);
  const [mode, setMode] = useState<"android" | "ios" | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* storage unavailable — still show the banner */
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
      setMode("android");
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    let timer: number | undefined;
    if (isIos()) {
      timer = window.setTimeout(() => {
        setMode("ios");
        setVisible(true);
      }, 2500);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    const promptEvent = deferred as unknown as {
      prompt: () => void;
      userChoice?: Promise<unknown>;
    } | null;
    if (!promptEvent) return;
    promptEvent.prompt();
    try {
      await promptEvent.userChoice;
    } catch {
      /* ignore */
    }
    dismiss();
  };

  if (!visible || !mode) return null;

  return (
    <div
      className="pwa-install"
      role="dialog"
      aria-label="Install the G-Tech app"
    >
      <button
        type="button"
        className="pwa-install-close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
      <div className="pwa-install-text">
        {mode === "android" ? (
          <>
            <p className="pwa-install-title">Install the G-Tech app</p>
            <p className="pwa-install-sub">
              Open the solar planner in one tap, even with poor network.
            </p>
          </>
        ) : (
          <>
            <p className="pwa-install-title">Add G-Tech to your home screen</p>
            <p className="pwa-install-sub">
              Tap <Share size={12} /> Share below, then &ldquo;Add to Home
              Screen&rdquo;.
            </p>
          </>
        )}
      </div>
      {mode === "android" ? (
        <button type="button" className="pwa-install-btn" onClick={install}>
          <Download size={14} /> Install
        </button>
      ) : (
        <button type="button" className="pwa-install-btn" onClick={dismiss}>
          Got it
        </button>
      )}
    </div>
  );
}
