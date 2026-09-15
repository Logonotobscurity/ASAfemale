import { useEffect, useRef, useState } from "react";
import { ThinkingOrb } from "thinking-orbs";
import { IconSearch } from "@/components/shop/icons";
import { PRODUCTS, type Product } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

type OrbState = "working" | "searching" | "solving" | "listening" | "connecting" | "weaving" | "composing" | "breathing" | "shaping";

function getSuggestions(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return PRODUCTS.filter((product) => terms.some((term) => `${product.name} ${product.cat} ${product.sku}`.toLowerCase().includes(term))).slice(0, 3);
}

export function AiShoppingAssistant() {
  const openPDP = useShop((state) => state.openPDP);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [orbState, setOrbState] = useState<OrbState>("breathing");
  const [listening, setListening] = useState(false);
  const [reply, setReply] = useState("Ask me to find a look, compare pieces, or guide you to checkout.");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const movedRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  function beginDrag(event: React.PointerEvent<HTMLElement>) {
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y };
    movedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) movedRef.current = true;
    const maxX = Math.max(0, window.innerWidth - 116);
    const maxY = Math.max(0, window.innerHeight - 132);
    setPosition({
      x: Math.min(maxX, Math.max(-window.innerWidth + 140, drag.originX + dx)),
      y: Math.min(maxY, Math.max(-window.innerHeight + 150, drag.originY + dy)),
    });
  }

  function endDrag(event: React.PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  }

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const suggestions = query.trim() ? getSuggestions(query) : [];

  function toggleVoice() {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      setReply("Voice search is not supported in this browser. Try typing your request instead.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      setOrbState("working");
      return;
    }
    const recognition = new SpeechRecognitionApi();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => { setListening(true); setOrbState("listening"); setReply("I’m listening. Tell me what you’re looking for."); };
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      setQuery(text);
      setReply(`Searching for “${text}”.`);
      setOrbState("searching");
    };
    recognition.onerror = () => { setListening(false); setOrbState("breathing"); setReply("I couldn’t hear that. You can try again or type below."); };
    recognition.onend = () => { setListening(false); setOrbState("searching"); };
    recognitionRef.current = recognition;
    recognition.start();
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setOrbState("searching");
    const match = suggestions[0];
    if (match) setReply(`I found ${match.name}. Here’s the closest match from the current collection.`);
    else setReply("I couldn’t find an exact match yet. Try a color, category, or style name.");
  }

  return (
    <aside
      className={`ai-assistant ${open ? "is-open" : ""}`}
      aria-label="AI shopping assistant"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      {open && (
        <div className="ai-panel">
          <div className="ai-panel-head">
            <div className="ai-orb-wrap"><ThinkingOrb state={orbState} size={64} /></div>
            <div><p className="m ai-kicker">ASA / AI STYLIST</p><h2>Find your next look</h2></div>
            <button type="button" className="ai-close" onClick={() => setOpen(false)} aria-label="Close shopping assistant">×</button>
          </div>
          <p className="ai-reply">{reply}</p>
          <form className="ai-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="assistant-query">Ask the shopping assistant</label>
            <input id="assistant-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “black evening gown”" />
            <button type="button" className={`ai-voice ${listening ? "is-listening" : ""}`} onClick={toggleVoice} aria-label={listening ? "Stop listening" : "Start voice search"}>●</button>
            <button type="submit" className="ai-submit" aria-label="Search with assistant"><IconSearch /></button>
          </form>
          {suggestions.length > 0 && <div className="ai-results">{suggestions.map((product: Product) => <button type="button" className="ai-result" key={product.sku} onClick={() => { openPDP(product); setOpen(false); }}><span>{product.name}</span><strong>${product.price}</strong></button>)}</div>}
          <p className="ai-note">Voice stays in your browser. No recording is stored.</p>
        </div>
      )}
      <button
        type="button"
        className="ai-launcher"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={() => {
          if (!movedRef.current) setOpen((value) => !value);
        }}
        aria-expanded={open}
        aria-label={open ? "Close AI shopping assistant" : "Open AI shopping assistant"}
      >
        <ThinkingOrb state={listening ? "listening" : open ? "composing" : "breathing"} size={64} />
        <span className="ai-launcher-label">{listening ? "LISTENING" : open ? "CLOSE" : "AI STYLIST"}</span>
      </button>
    </aside>
  );
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
  }
  interface SpeechRecognitionEvent extends Event { results: SpeechRecognitionResultList; }
}
