import { useEffect } from "react";
import { AiShoppingAssistant } from "@/components/shop/ai-shopping-assistant";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { CatNav } from "@/components/shop/cat-nav";
import { CobrowseFab } from "@/components/shop/cobrowse-fab";
import { PdpOverlay } from "@/components/shop/pdp-overlay";
import { Catalog } from "@/components/shop/product-section";
import { Rail } from "@/components/shop/rail";
import { ShopFooter } from "@/components/shop/shop-footer";
import { SmsSheet } from "@/components/shop/sms-sheet";
import { Toast } from "@/components/shop/toast";
import { gatesOK, hydrateShop, useShop } from "@/lib/shop-store";

export function ShopApp() {
  const setOffline = useShop((s) => s.setOffline);

  useEffect(() => {
    // Each storefront entry starts at the top with transient overlays closed.
    // Persisted cart and wishlist state remain available across sessions.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const state = useShop.getState();
    state.closeSheet("route-entry", false);
    state.closePDP();
    state.closeCart();
    hydrateShop();
    useShop.getState().setHydrated(true);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [setOffline]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const st = useShop.getState();
      if (st.sheetOpen) st.closeSheet("esc", true);
      else if (st.pdpOpen) st.closePDP();
      else if (st.cartOpen) st.closeCart();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const d = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        const st = useShop.getState();
        if (d >= 0.6 && gatesOK(st.pdpOpen, st.cartOpen)) st.openSheet("scroll_60");
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const sectionObs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const st = useShop.getState();
          if (gatesOK(st.pdpOpen, st.cartOpen)) st.openSheet("section_3");
        }
      },
      { threshold: 0.4 },
    );
    const head = document.querySelector("#cat-gown .sechead");
    if (head) sectionObs.observe(head);

    const dwell = window.setTimeout(() => {
      const st = useShop.getState();
      if (gatesOK(st.pdpOpen, st.cartOpen)) st.openSheet("dwell_45");
    }, 45000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      sectionObs.disconnect();
      window.clearTimeout(dwell);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        SKIP TO CONTENT
      </a>
      <Rail />
      <main id="main">
        <CatNav />
        <Catalog />
        <ShopFooter />
      </main>
      <PdpOverlay />
      <CartDrawer />
      <SmsSheet />
      <CobrowseFab />
      <AiShoppingAssistant />
      <Toast />
    </>
  );
}
