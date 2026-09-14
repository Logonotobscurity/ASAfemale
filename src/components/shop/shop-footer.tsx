import { useShop } from "@/lib/shop-store";

export function ShopFooter() {
  const showToast = useShop((s) => s.showToast);
  const openSheet = useShop((s) => s.openSheet);
  return (
    <footer className="foot">
      <div>
        <h4 className="m">ÀṢÀ — WOMENSWEAR</h4>
        <p>
          Skirts, trousers, mamiwata gowns and tennis skirts. Cut and sewn in Lagos. Every drop
          texted to the list first — never emailed, never spammed.
        </p>
      </div>
      <div>
        <h4 className="m">HELP</h4>
        {["SHIPPING & RETURNS", "SIZE GUIDE", "TEXT STOP TO OPT OUT"].map((label) => (
          <button
            key={label}
            type="button"
            className="m flink"
            onClick={() => showToast(`${label} — DETAILS COMING SOON`)}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        <h4 className="m">STAY IN THE KNOW</h4>
        <button type="button" className="m flink" onClick={() => openSheet("footer")}>JOIN THE SMS LIST</button>
        <p>Early access to limited drops, private fittings, and studio notes.</p>
      </div>
      <div className="footbot m">© 2025 ÀṢÀ — LAGOS · ABUJA · +234 · ALL DROPS TEXTED FIRST</div>
    </footer>
  );
}
