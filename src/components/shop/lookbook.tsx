import { IconArrow } from "@/components/shop/icons";
import { Silhouette } from "@/components/silhouettes";

export function Lookbook() {
  return (
    <section className="lookbook" aria-label="Lookbook 01">
      <div className="lb-mirror">
        <Silhouette art="pleat" />
      </div>
      <div className="lb-fig">
        <Silhouette art="pleat" />
      </div>
      <div className="lb-curtain" />
      <span className="lb-tag m">LOOKBOOK 01 — FILMED IN-STUDIO</span>
      <span className="lb-cap m">
        EXACTLY AS SEEN <IconArrow />
      </span>
    </section>
  );
}
