import { useEffect, useRef } from "react";
import { IconChevron, IconClose, IconFind, IconHeart } from "@/components/shop/icons";
import { Silhouette } from "@/components/silhouettes";
import { naira } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export function PdpOverlay() {
  const pdp = useShop((s) => s.pdp);
  const pdpOpen = useShop((s) => s.pdpOpen);
  const pdpView = useShop((s) => s.pdpView);
  const selSize = useShop((s) => s.selSize);
  const liked = useShop((s) => s.liked);
  const shakeChips = useShop((s) => s.shakeChips);
  const closePDP = useShop((s) => s.closePDP);
  const setPdpView = useShop((s) => s.setPdpView);
  const setSize = useShop((s) => s.setSize);
  const toggleLike = useShop((s) => s.toggleLike);
  const addToBag = useShop((s) => s.addToBag);
  const findSimilar = useShop((s) => s.findSimilar);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shakeChips) return;
    const el = chipsRef.current;
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }, [shakeChips]);

  return (
    <div
      className={"overlay" + (pdpOpen ? " open" : "")}
      role="dialog"
      aria-modal="true"
      aria-label="Product detail"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePDP();
      }}
    >
      {pdp ? (
        <div className="pdp">
          <button type="button" className="x" aria-label="Close" onClick={closePDP}>
            <IconClose />
          </button>
          <button
            type="button"
            className={"heart" + (liked ? " liked" : "")}
            aria-label="Save to likes"
            onClick={toggleLike}
          >
            <IconHeart />
          </button>
          <div className="pdpmedia">
            <div
              className={"pdpmimg" + (pdpView === 1 ? " zoom" : "")}
              style={{ ["--focal" as string]: pdp.focal }}
            >
              {pdp.photo ? (
                <img
                  src={pdp.photo.src}
                  alt={pdp.name}
                  style={{ ["--focal" as string]: pdp.focal }}
                />
              ) : (
                <Silhouette art={pdp.art} />
              )}
            </div>
            <div className="hs show">
              <span className="hsdot" />
              <button type="button" className="pill" onClick={() => findSimilar(pdp)}>
                <IconFind />
                Find similar
                <IconChevron />
              </button>
            </div>
          </div>
          <div className="pdpdots" role="tablist" aria-label="Media views">
            <button
              type="button"
              className={pdpView === 0 ? "on" : ""}
              aria-label="View 1"
              onClick={() => setPdpView(0)}
            />
            <button
              type="button"
              className={pdpView === 1 ? "on" : ""}
              aria-label="View 2 — detail crop"
              onClick={() => setPdpView(1)}
            />
          </div>
          <div className="pdpinfo">
            <div className="pdptitle">
              <h2>{pdp.name}</h2>
              <span className="m sku">{pdp.sku}</span>
            </div>
            <div className="pricerow">
              <span className="m now">{naira(pdp.price)}</span>
              {pdp.old ? <span className="m old">{naira(pdp.old)}</span> : null}
            </div>
            <span className="m lbl">SELECT SIZE</span>
            <div className="chips" ref={chipsRef}>
              {pdp.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={"m" + (selSize === s ? " on" : "")}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="ship">or shipping.</div>
            <button type="button" className="cta m" onClick={addToBag}>
              ADD TO BAG — {naira(pdp.price)}
            </button>
            <span className="m fabnote">{pdp.fab}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
