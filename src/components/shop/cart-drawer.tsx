import { useState } from "react";
import { IconClose } from "@/components/shop/icons";
import { Silhouette } from "@/components/silhouettes";
import { naira } from "@/lib/catalog";
import { createWhatsAppCheckout } from "@/lib/commerce";
import { useShop } from "@/lib/shop-store";

export function CartDrawer() {
  const cart = useShop((s) => s.cart);
  const cartOpen = useShop((s) => s.cartOpen);
  const closeCart = useShop((s) => s.closeCart);
  const removeCart = useShop((s) => s.removeCart);
  const checkout = useShop((s) => s.checkout);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const total = cart.reduce((s, i) => s + i.price, 0);

  async function startCheckout() {
    if (cart.length === 0 || isCheckingOut) return;
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const result = await createWhatsAppCheckout({
        data: {
          tenantId: "asa-default",
          items: cart.map((item) => ({ sku: item.sku, size: String(item.size), quantity: 1 })),
        },
      });
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      checkout();
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout is temporarily unavailable.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <>
      <div className={"dback" + (cartOpen ? " open" : "")} onClick={closeCart} />
      <aside
        className={"drawer" + (cartOpen ? " open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="dhead">
          <span className="m">BAG ({cart.length})</span>
          <button type="button" aria-label="Close bag" onClick={closeCart}>
            <IconClose />
          </button>
        </div>
        <ul id="cartList">
          {cart.length === 0 ? (
            <li className="empty m">YOUR BAG IS EMPTY</li>
          ) : (
            cart.map((it, i) => (
              <li className="ci" key={`${it.sku}-${it.size}-${i}`}>
                <span className="thumb">
                  <Silhouette art={it.art} />
                </span>
                <span>
                  <span className="nm">{it.name}</span>
                  <br />
                  <span className="mt m">
                    {it.sku} · SIZE {it.size}
                  </span>
                  <br />
                  <button type="button" className="rm m" onClick={() => removeCart(i)}>
                    REMOVE
                  </button>
                </span>
                <span className="pr m">{naira(it.price)}</span>
              </li>
            ))
          )}
        </ul>
        <div className="dfoot">
          <div className="subrow m">
            <span>SUBTOTAL</span>
            <span>{naira(total)}</span>
          </div>
          {checkoutError ? <p className="mt m" role="alert">{checkoutError}</p> : null}
          <button type="button" className="cta m" onClick={startCheckout} disabled={isCheckingOut || cart.length === 0}>
            {isCheckingOut ? "PREPARING WHATSAPP…" : "CHECKOUT VIA WHATSAPP"}
          </button>
        </div>
      </aside>
    </>
  );
}
