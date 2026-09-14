import { IconPerson } from "@/components/shop/icons";
import { useShop } from "@/lib/shop-store";

export function CobrowseFab() {
  const showToast = useShop((s) => s.showToast);
  return (
    <div className="fabwrap">
      <span className="avatar" aria-hidden="true">
        <IconPerson />
      </span>
      <button
        type="button"
        className="fabplus"
        aria-label="Co-browsing presence"
        onClick={() => showToast("CO-BROWSING: 1 FRIEND VIEWING THIS DROP")}
      >
        +
      </button>
    </div>
  );
}
