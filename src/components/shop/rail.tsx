import { useEffect, useRef } from "react";
import { IconBag, IconInstagram, IconLogo, IconPhone, IconTikTok, IconX } from "@/components/shop/icons";
import { useShop } from "@/lib/shop-store";

export function Rail() {
  const cart = useShop((s) => s.cart);
  const openCart = useShop((s) => s.openCart);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const count = cart.length;

  useEffect(() => {
    const el = badgeRef.current;
    if (!el || count === 0) return;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }, [count]);

  return (
    <aside className="rail" aria-label="Brand rail">
      <button
        type="button"
        className="logo"
        aria-label="ÀṢÀ — back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <IconLogo />
      </button>
      <button type="button" className="bagbtn" aria-label="Open shopping bag" onClick={openCart}>
        <IconBag />
        <span className="badge m" ref={badgeRef} hidden={count === 0}>
          {count}
        </span>
      </button>
      <div className="railspacer" />
      <nav className="socials" aria-label="Contact and social links">
        <a href="tel:+2348012345678" aria-label="Call us">
          <IconPhone />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <IconInstagram />
        </a>
        <a className="fill" href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
          <IconX />
        </a>
        <a className="fill" href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <IconTikTok />
        </a>
      </nav>
    </aside>
  );
}
