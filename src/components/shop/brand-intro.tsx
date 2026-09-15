import { useEffect, useState } from "react";
import { ThinkingOrb } from "thinking-orbs";
import { IconArrow, IconLogo } from "@/components/shop/icons";

type BrandIntroProps = { onEnter: () => void };

export function BrandIntro({ onEnter }: BrandIntroProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLeaving(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onEnter, 650);
    return () => window.clearTimeout(timer);
  }, [leaving, onEnter]);

  function enterStore() {
    setLeaving(true);
  }

  return (
    <section className={`brand-intro ${leaving ? "is-leaving" : ""}`} aria-label="Welcome to ASA">
      <div className="brand-intro-top">
        <span className="brand-intro-mark"><IconLogo /></span>
        <span className="m">ASA / FEMALE</span>
        <span className="m">EST. 2024</span>
      </div>
      <div className="brand-intro-center">
        <p className="m brand-intro-kicker">A considered wardrobe, assisted</p>
        <h1>Wear your<br /><em>point of view.</em></h1>
        <p className="brand-intro-copy">Discover a sharper edit of modern feminine dressing, with an AI stylist that listens before it recommends.</p>
        <button type="button" className="brand-intro-enter" onClick={enterStore}>
          <span>Enter the collection</span><IconArrow />
        </button>
      </div>
      <div className="brand-intro-bottom">
        <div className="brand-intro-features"><span>Curated edits</span><span>Voice styling</span><span>Human connection</span></div>
        <div className="brand-intro-orb"><ThinkingOrb state="weaving" size={20} /><span className="m">YOUR STYLIST IS READY</span></div>
      </div>
    </section>
  );
}
