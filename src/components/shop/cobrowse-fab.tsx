import { IconArrow, IconPerson } from "@/components/shop/icons";
import { useShop } from "@/lib/shop-store";

export function CobrowseFab() {
  const showToast = useShop((s) => s.showToast);
  return (
    <div className="fabwrap">
      <button
        type="button"
        className="cobrowse-card"
        aria-label="Start a co-browsing session"
        onClick={() => showToast("CO-BROWSING REQUEST SENT — A STYLE GUIDE WILL JOIN SHORTLY")}
      >
        <span className="avatar" aria-hidden="true"><IconPerson /></span>
        <span className="cobrowse-copy"><strong>Style together</strong><small>Invite a guide to this look</small></span>
        <IconArrow />
      </button>
    </div>
  );
}
