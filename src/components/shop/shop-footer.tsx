import { useShop } from "@/lib/shop-store";

export function ShopFooter() {
  const showToast = useShop((s) => s.showToast);
  const openSheet = useShop((s) => s.openSheet);

  function resetDemo() {
    try {
      localStorage.removeItem("asa_sub");
      localStorage.removeItem("asa_dismiss");
      sessionStorage.removeItem("asa_shown");
    } catch {
      /* ignore */
    }
    location.reload();
  }

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
            onClick={() => showToast(label + " — DEMO")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="demo">
        <h4 className="m">DEMO CONTROLS</h4>
        <button type="button" className="m" onClick={() => openSheet("manual_preview")}>
          PREVIEW SMS SHEET
        </button>
        <button type="button" className="m" onClick={resetDemo}>
          RESET DEMO STATE
        </button>
      </div>
      <div className="footbot m">© 2025 ÀṢÀ — LAGOS · ABUJA · +234 · ALL DROPS TEXTED FIRST</div>
    </footer>
  );
}
