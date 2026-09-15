import { useState } from "react";
import { IconArrow, IconPerson } from "@/components/shop/icons";
import { useShop } from "@/lib/shop-store";

export function CobrowseFab() {
  const showToast = useShop((s) => s.showToast);
  const [open, setOpen] = useState(false);
  const [split, setSplit] = useState(true);
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  async function shareSession() {
    const code = sessionCode ?? Math.random().toString(36).slice(2, 8).toUpperCase();
    setSessionCode(code);
    const shareUrl = `${window.location.origin}/store?room=${code}`;
    const shareData = { title: "Shop together on ÀṢÀ", text: "Join my ÀṢÀ co-browsing room and style the look with me.", url: shareUrl };
    if (navigator.share) await navigator.share(shareData).catch(() => undefined);
    else if (navigator.clipboard) await navigator.clipboard.writeText(shareUrl);
    showToast("INVITE READY — SEND IT TO YOUR STYLE PARTNER");
  }

  return (
    <div className={`fabwrap ${open ? "is-open" : ""}`}>
      {open && (
        <div className="cobrowse-panel" role="dialog" aria-label="Style together">
          <div className="cobrowse-panel-head"><div><p className="m">ÀṢÀ / SOCIAL SHOPPING</p><h2>Style together</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close co-browsing panel">×</button></div>
          <p className="cobrowse-lede">Share this room with a friend. Browse the same edit, compare pieces, and decide who pays.</p>
          <div className="cobrowse-people"><span className="avatar"><IconPerson /></span><span className="avatar guest"><IconPerson /></span><span><strong>You + a friend</strong><small>{sessionCode ? `Room ${sessionCode}` : "No one has joined yet"}</small></span></div>
          <div className="cobrowse-payment"><p className="m">CHECKOUT PLAN</p><label><input type="radio" checked={split} onChange={() => setSplit(true)} /> Split payment 50 / 50</label><label><input type="radio" checked={!split} onChange={() => setSplit(false)} /> One friend pays</label></div>
          <button type="button" className="cobrowse-share" onClick={shareSession}><span>{sessionCode ? "Share room again" : "Create invite link"}</span><IconArrow /></button>
          <button type="button" className="cobrowse-social" onClick={() => showToast("SOCIAL SHARE READY — COPY THE ROOM LINK OR USE YOUR DEVICE SHARE")}>Share to socials</button>
          <p className="cobrowse-note">Both shoppers must confirm before any split payment is submitted.</p>
        </div>
      )}
      <button type="button" className="cobrowse-card" aria-label={open ? "Close co-browsing session" : "Start a co-browsing session"} onClick={() => setOpen((value) => !value)}>
        <span className="avatar" aria-hidden="true"><IconPerson /></span>
        <span className="cobrowse-copy"><strong>{open ? "Close room" : "Style together"}</strong><small>{open ? "Your invite stays ready" : "Invite a friend to this edit"}</small></span>
        <IconArrow />
      </button>
    </div>
  );
}
