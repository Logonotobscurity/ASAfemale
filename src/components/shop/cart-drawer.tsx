import { IconClose } from "@/components/shop/icons";
import { Silhouette } from "@/components/silhouettes";
import { naira } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export function CartDrawer() {
  const cart = useShop((s) => s.cart);
  const cartOpen = useShop((s) => s.cartOpen);
  const closeCart = useShop((s) => s.closeCart);
  const removeCart = useShop((s) => s.removeCart);
  const checkout = useShop((s) => s.checkout);
  const total = cart.reduce((s, i) => s + i.price, 0);

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
          <button type="button" className="cta m" onClick={checkout}>
            CHECKOUT
          </button>
        </div>
      </aside>
    </>
  );
}
