import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Mic, Volume2, VolumeX } from "lucide-react";
import "./chat-widget.css";

const API_URL = "https://chat.gtechconsult.ng/api/chat";
const API_TRANSCRIBE_URL = "https://chat.gtechconsult.ng/api/transcribe";
const MAX_RECORD_SECS = 60;
const HISTORY_KEY = "gtc-chat-history";
const SESSION_KEY = "gtc-chat-session";
const MAX_HISTORY = 30;
const CONTEXT_WINDOW = 12;
const WHATSAPP_HUMAN = "https://wa.me/2348167498489";

const WELCOME =
  "Hello! I'm G-Tech's assistant. I can help you size a solar system from your appliances, estimate your fuel savings, show our packages, or connect you with a human. What would you like to do?";

const FALLBACK_CHIPS = ["Size my solar", "Fuel savings", "See packages", "Talk to a human"];

const ERROR_MESSAGE =
  "Sorry, I'm having trouble connecting right now. Please try again in a moment — or reach us directly on WhatsApp.";

interface Plan {
  summary: string;
  package: string;
  price: string;
  loads: string[];
  whatsapp_link: string;
}

interface Cta {
  label: string;
  href: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  plan?: Plan | null;
  cta?: Cta | null;
}

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      /* fall through to manual uuid */
    }
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = newSessionId();
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return newSessionId();
  }
}

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .slice(-MAX_HISTORY);
  } catch {
    return [];
  }
}

/** Pick a recording mime type the browser can handle (iOS Safari -> audio/mp4). */
function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
    return undefined;
  }
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const t of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(t)) return t;
    } catch {
      /* ignore */
    }
  }
  return undefined;
}

/** Render plain-text paragraphs, turning bare URLs into links. */
const URL_SPLIT_RE = /(https?:\/\/[^\s)]+)/g;
const URL_TEST_RE = /^https?:\/\/[^\s)]+$/;
function renderParagraphs(content: string) {
  return content.split(/\n\n+/).map((para, i) => {
    const parts = para.split(URL_SPLIT_RE);
    return (
      <p key={i} className="gtc-chat-para">
        {parts.map((part, j) =>
          URL_TEST_RE.test(part) ? (
            <a
              key={j}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="gtc-chat-link"
            >
              {part}
            </a>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    );
  });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory());
  const [quickReplies, setQuickReplies] = useState<string[]>(FALLBACK_CHIPS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speechOn, setSpeechOn] = useState(false);
  const [micSupported, setMicSupported] = useState(false);

  const sessionIdRef = useRef<string>("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<{ recorder: MediaRecorder; stopTimer: number; stopped: boolean } | null>(null);
  const sendingRef = useRef(false);
  const hasWelcomedRef = useRef(false);

  // session id (client only)
  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  // mic support detection (client only) — recording works on iOS Safari, Android Chrome, desktop
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = window.navigator as Navigator & { mediaDevices?: MediaDevices };
    setMicSupported(
      typeof MediaRecorder !== "undefined" &&
        !!nav.mediaDevices &&
        typeof nav.mediaDevices.getUserMedia === "function"
    );
  }, []);

  // persist history
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch {
      /* storage unavailable or full — chat still works */
    }
  }, [messages]);

  // auto-scroll to latest message
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  // focus input when panel opens
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open ]);

  // Esc closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  // stop an in-progress voice recording
  const stopActiveRecording = useCallback(() => {
    const a = recRef.current;
    if (!a || a.stopped) return;
    a.stopped = true;
    window.clearTimeout(a.stopTimer);
    try {
      a.recorder.stop();
    } catch {
      /* ignore */
    }
  }, []);

  // stop speech + recording when the panel closes
  useEffect(() => {
    if (!open && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (!open) stopActiveRecording();
  }, [open, stopActiveRecording]);

  // stop speech + recording on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      stopActiveRecording();
    };
  }, [stopActiveRecording]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-NG";
      window.speechSynthesis.speak(utter);
    } catch {
      /* speech unavailable — stay silent */
    }
  }, []);

  const toggleSpeech = useCallback(() => {
    setSpeechOn((prev) => {
      if (prev && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  }, []);

  const appendMessages = useCallback((next: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...next].slice(-MAX_HISTORY));
  }, []);

  const sendToApi = useCallback(
    async (history: ChatMessage[]) => {
      setTyping(true);
      try {
        const payload = history.slice(-CONTEXT_WINDOW).map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionIdRef.current, messages: payload }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) {
          // Prefer the server's own friendly message (e.g. rate-limit notice).
          const serverReply =
            data && typeof data.reply === "string" && data.reply.trim()
              ? data.reply
              : ERROR_MESSAGE;
          appendMessages([{ role: "assistant", content: serverReply }]);
          setQuickReplies(FALLBACK_CHIPS);
          return;
        }
        const reply: ChatMessage = {
          role: "assistant",
          content: typeof data.reply === "string" && data.reply.trim() ? data.reply : ERROR_MESSAGE,
          plan: data.plan ?? null,
        };
        appendMessages([reply]);
        setQuickReplies(
          Array.isArray(data.quick_replies) && data.quick_replies.length > 0
            ? data.quick_replies.slice(0, 4)
            : FALLBACK_CHIPS
        );
        if (speechOn) speak(reply.content);
      } catch {
        const fallback: ChatMessage = {
          role: "assistant",
          content: ERROR_MESSAGE,
          cta: { label: "Chat on WhatsApp", href: WHATSAPP_HUMAN },
        };
        appendMessages([fallback]);
        setQuickReplies(FALLBACK_CHIPS);
      } finally {
        setTyping(false);
        sendingRef.current = false;
      }
    },
    [appendMessages, speak, speechOn]
  );

  const sendMessage = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || sendingRef.current) return;
      sendingRef.current = true;
      setQuickReplies([]);
      setInput("");
      setTyping(false);

      // local shortcut — no API call needed
      if (text.toLowerCase() === "talk to a human") {
        const userMsg: ChatMessage = { role: "user", content: text };
        const humanMsg: ChatMessage = {
          role: "assistant",
          content:
            "Of course. Tap the button below and a member of the G-Tech team will continue with you on WhatsApp.",
          cta: { label: "Chat on WhatsApp", href: WHATSAPP_HUMAN },
        };
        appendMessages([userMsg, humanMsg]);
        setQuickReplies(FALLBACK_CHIPS);
        if (speechOn) speak(humanMsg.content);
        sendingRef.current = false;
        return;
      }

      const history = [...messages, { role: "user" as const, content: text }];
      appendMessages([{ role: "user", content: text }]);
      void sendToApi(history);
    },
    [messages, appendMessages, sendToApi, speak, speechOn]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const openPanel = useCallback(() => {
    setOpen(true);
    if (!hasWelcomedRef.current) {
      hasWelcomedRef.current = true;
      if (messages.length === 0) {
        appendMessages([{ role: "assistant", content: WELCOME }]);
        setQuickReplies(FALLBACK_CHIPS);
      }
    }
  }, [appendMessages, messages.length]);

  const uploadVoiceNote = useCallback(
    async (chunks: Blob[], mimeType: string) => {
      if (!chunks.length) {
        appendMessages([
          { role: "assistant", content: "I didn't catch any audio — please try again or type your message." },
        ]);
        return;
      }
      setTyping(true);
      try {
        const blob = new Blob(chunks, { type: mimeType });
        const res = await fetch(API_TRANSCRIBE_URL, {
          method: "POST",
          headers: { "Content-Type": mimeType },
          body: blob,
        });
        const data = await res.json().catch(() => null);
        const text = data && typeof data.text === "string" ? data.text.trim() : "";
        if (text) {
          sendMessage(text);
        } else {
          appendMessages([
            {
              role: "assistant",
              content:
                (data && typeof data.reply === "string" && data.reply) ||
                "Sorry, I couldn't understand that voice note — please try again or type your message.",
            },
          ]);
        }
      } catch {
        appendMessages([
          {
            role: "assistant",
            content: "Sorry, I couldn't process that voice note — please try again or type your message.",
          },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [appendMessages, sendMessage]
  );

  const toggleMic = useCallback(() => {
    if (typeof window === "undefined") return;
    // second tap stops the recording and sends it off for transcription
    if (recRef.current) {
      stopActiveRecording();
      return;
    }
    const nav = window.navigator as Navigator & { mediaDevices?: MediaDevices };
    if (typeof MediaRecorder === "undefined" || !nav.mediaDevices?.getUserMedia) {
      appendMessages([
        { role: "assistant", content: "Voice notes aren't supported in this browser — please type your message instead." },
      ]);
      return;
    }
    setRecording(true);
    nav.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const chosenMime = pickRecorderMime();
        let recorder: MediaRecorder;
        try {
          recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
        } catch {
          stream.getTracks().forEach((t) => t.stop());
          setRecording(false);
          appendMessages([
            { role: "assistant", content: "Couldn't start recording — please try again or type your message." },
          ]);
          return;
        }
        const effectiveMime = recorder.mimeType || chosenMime || "audio/webm";
        const chunks: Blob[] = [];
        let settled = false;
        const finish = (ok: boolean) => {
          if (settled) return;
          settled = true;
          recRef.current = null;
          setRecording(false);
          stream.getTracks().forEach((t) => t.stop());
          if (ok) {
            void uploadVoiceNote(chunks, effectiveMime);
          } else {
            appendMessages([
              { role: "assistant", content: "Recording failed — please try again or type your message." },
            ]);
          }
        };
        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = () => finish(true);
        recorder.onerror = () => finish(false);
        const stopTimer = window.setTimeout(() => stopActiveRecording(), MAX_RECORD_SECS * 1000);
        recRef.current = { recorder, stopTimer, stopped: false };
        try {
          recorder.start(250);
        } catch {
          window.clearTimeout(stopTimer);
          finish(false);
        }
      })
      .catch(() => {
        setRecording(false);
        appendMessages([
          {
            role: "assistant",
            content:
              "I can't reach your microphone. Please allow microphone access in your browser settings and try again — or just type your message.",
          },
        ]);
      });
  }, [appendMessages, stopActiveRecording, uploadVoiceNote]);

  return (
    <>
      {!open && (
        <button
          type="button"
          className="gtc-chat-launcher"
          onClick={openPanel}
          aria-label="Open chat with G-Tech"
        >
          <MessageCircle size={26} aria-hidden="true" />
          <span className="gtc-chat-dot" aria-hidden="true" />
        </button>
      )}

      {open && (
        <section
          className="gtc-chat-panel"
          role="dialog"
          aria-label="Chat with G-Tech"
          aria-modal="false"
        >
          <header className="gtc-chat-header">
            <div className="gtc-chat-header-text">
              <h2 className="gtc-chat-title">Chat with G-Tech</h2>
              <p className="gtc-chat-subtitle">Solar, CCTV &amp; smart home help</p>
            </div>
            <div className="gtc-chat-header-actions">
              <button
                type="button"
                className="gtc-chat-icon-btn"
                onClick={toggleSpeech}
                aria-label={speechOn ? "Turn off voice replies" : "Turn on voice replies"}
                aria-pressed={speechOn}
                title={speechOn ? "Voice replies on" : "Voice replies off"}
              >
                {speechOn ? (
                  <Volume2 size={18} aria-hidden="true" />
                ) : (
                  <VolumeX size={18} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                className="gtc-chat-icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="gtc-chat-messages" ref={messagesRef} aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`gtc-chat-row ${m.role === "user" ? "gtc-chat-row-user" : "gtc-chat-row-assistant"}`}
              >
                <div
                  className={`gtc-chat-bubble ${m.role === "user" ? "gtc-chat-bubble-user" : "gtc-chat-bubble-assistant"}`}
                >
                  {renderParagraphs(m.content)}
                  {m.plan && (
                    <div className="gtc-chat-plan">
                      <p className="gtc-chat-plan-summary">{m.plan.summary}</p>
                      <p className="gtc-chat-plan-package">
                        {m.plan.package} <span className="gtc-chat-plan-price">{m.plan.price}</span>
                      </p>
                      {m.plan.loads && m.plan.loads.length > 0 && (
                        <ul className="gtc-chat-plan-loads">
                          {m.plan.loads.map((load, j) => (
                            <li key={j}>{load}</li>
                          ))}
                        </ul>
                      )}
                      <a
                        className="gtc-chat-plan-cta"
                        href={m.plan.whatsapp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Send plan on WhatsApp
                      </a>
                    </div>
                  )}
                  {m.cta && (
                    <a
                      className="gtc-chat-cta"
                      href={m.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {m.cta.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="gtc-chat-row gtc-chat-row-assistant">
                <div className="gtc-chat-bubble gtc-chat-bubble-assistant gtc-chat-typing" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {quickReplies.length > 0 && !typing && (
            <div className="gtc-chat-chips">
              {quickReplies.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="gtc-chat-chip"
                  onClick={() => sendMessage(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form className="gtc-chat-input-row" onSubmit={handleSubmit}>
            {micSupported && (
              <button
                type="button"
                className={`gtc-chat-icon-btn gtc-chat-mic ${recording ? "gtc-chat-mic-active" : ""}`}
                onClick={toggleMic}
                aria-label={recording ? "Stop recording and send" : "Record a voice note"}
                aria-pressed={recording}
              >
                <Mic size={18} aria-hidden="true" />
              </button>
            )}
            <input
              ref={inputRef}
              type="text"
              className="gtc-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={recording ? "Recording… tap mic to stop" : "Type your message…"}
              aria-label="Type your message"
              autoComplete="off"
            />
            <button
              type="submit"
              className="gtc-chat-send"
              aria-label="Send message"
              disabled={!input.trim()}
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
