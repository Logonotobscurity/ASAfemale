import { Fragment, type KeyboardEvent, type MouseEvent } from "react";
import { IconChevron, IconFind } from "@/components/shop/icons";
import { Silhouette } from "@/components/silhouettes";
import { CATS, naira, productsIn, type Product } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";
import { Lookbook } from "@/components/shop/lookbook";

function MediaInner({ product }: { product: Product }) {
  if (product.photo) {
    return (
      <picture>
        <source type="image/avif" srcSet={product.photo.srcset || product.photo.src} />
        <img
          className="art"
          src={product.photo.src}
          width={4}
          height={5}
          loading="lazy"
          decoding="async"
          sizes="calc((100vw - 56px - 40px)/2), (min-width:768px) calc((100vw - 72px - 96px)/4), (min-width:1280px) calc((100vw - 72px - 96px)/6)"
          alt={product.name}
          style={{ ["--focal" as string]: product.focal }}
        />
      </picture>
    );
  }
  return <Silhouette art={product.art} className="art" />;
}

function Tile({ product }: { product: Product }) {
  const openPDP = useShop((s) => s.openPDP);
  const findSimilar = useShop((s) => s.findSimilar);

  function onFind(e: MouseEvent) {
    e.stopPropagation();
    findSimilar(product);
  }

  function onKey(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") openPDP(product);
  }

  return (
    <article
      className="tile"
      data-sku={product.sku}
      tabIndex={0}
      role="button"
      aria-label={`${product.name}, ${naira(product.price)}`}
      onClick={() => openPDP(product)}
      onKeyDown={onKey}
    >
      <div className="media" style={{ ["--focal" as string]: product.focal }}>
        <MediaInner product={product} />
        <div className="hs">
          <span className="hsdot" />
          <button type="button" className="pill" tabIndex={-1} onClick={onFind}>
            <IconFind />
            Find similar
            <IconChevron />
          </button>
        </div>
      </div>
      <div className="cap">
        <div className="row">
          <span className="sku m">{product.sku}</span>
          <span className="price m">{naira(product.price)}</span>
        </div>
        <div className="name">{product.name}</div>
      </div>
    </article>
  );
}

export function Catalog() {
  return (
    <div id="sections">
      {CATS.map((c) => {
        const items = productsIn(c.id);
        return (
          <Fragment key={c.id}>
            {c.id === "gown" ? <Lookbook /> : null}
            <section className="sect" id={"cat-" + c.id}>
              <div className="sechead">
                <span className="lbl m">{c.label}</span>
                <span className="cnt m">({String(items.length).padStart(2, "0")})</span>
                <span className="rule" />
              </div>
              <div className="grid">
                {items.map((p) => (
                  <Tile key={p.sku} product={p} />
                ))}
              </div>
            </section>
          </Fragment>
        );
      })}
    </div>
  );
}
