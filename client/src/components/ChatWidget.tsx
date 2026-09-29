import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Mic, Volume2, VolumeX } from "lucide-react";
import "./chat-widget.css";

const API_URL = "https://chat.gtechconsult.ng/api/chat";
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
  const [listening, setListening] = useState(false);
  const [speechOn, setSpeechOn] = useState(false);
  const [micSupported, setMicSupported] = useState(false);

  const sessionIdRef = useRef<string>("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const sendingRef = useRef(false);
  const hasWelcomedRef = useRef(false);

  // session id (client only)
  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  // mic support detection (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as Record<string, unknown>;
    setMicSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
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

  // stop speech when the panel closes
  useEffect(() => {
    if (!open && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [open ]);

  // stop speech + recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      recRef.current?.stop();
    };
  }, []);

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

  const toggleMic = useCallback(() => {
    if (typeof window === "undefined") return;
    if (listening) {
      try {
        recRef.current?.stop();
      } catch {
        /* ignore */
      }
      setListening(false);
      return;
    }
    const w = window as unknown as Record<string, any>;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    try {
      const rec = new SR();
      rec.lang = "en-NG";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      recRef.current = rec;
      rec.onresult = (e: any) => {
        const transcript: string = e?.results?.[0]?.[0]?.transcript ?? "";
        setListening(false);
        if (transcript.trim()) sendMessage(transcript.trim());
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [listening, sendMessage]);

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
                className={`gtc-chat-icon-btn gtc-chat-mic ${listening ? "gtc-chat-mic-active" : ""}`}
                onClick={toggleMic}
                aria-label={listening ? "Stop listening" : "Speak your message"}
                aria-pressed={listening}
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
              placeholder={listening ? "Listening…" : "Type your message…"}
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
