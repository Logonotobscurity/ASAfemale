import { useShop } from "@/lib/shop-store";

export function Toast() {
  const toast = useShop((s) => s.toast);
  return (
    <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">
      {toast}
    </div>
  );
}
