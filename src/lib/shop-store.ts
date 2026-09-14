import { create } from "zustand";
import { type ArtId, type Product, track } from "@/lib/catalog";

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  size: number;
  art: ArtId;
};

export type Activity = {
  id: string;
  label: string;
  createdAt: number;
};

export type ShopState = {
  cart: CartItem[];
  pdp: Product | null;
  pdpOpen: boolean;
  pdpView: 0 | 1;
  selSize: number | null;
  liked: boolean;
  cartOpen: boolean;
  toast: string | null;
  sheetOpen: boolean;
  activities: Activity[];
  hydrated: boolean;
  offline: boolean;
  setHydrated: (hydrated: boolean) => void;
  setOffline: (offline: boolean) => void;
  clearActivities: () => void;
  resetDemo: () => void;
  recordActivity: (label: string) => void;
  shakeChips: number;
  openPDP: (p: Product) => void;
  closePDP: () => void;
  setPdpView: (v: 0 | 1) => void;
  setSize: (s: number) => void;
  toggleLike: () => void;
  addToBag: () => void;
  openCart: () => void;
  closeCart: () => void;
  removeCart: (index: number) => void;
  checkout: () => void;
  showToast: (msg: string) => void;
  openSheet: (reason: string) => boolean;
  closeSheet: (method: string, dismissed: boolean) => void;
  findSimilar: (p: Product) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function lsGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

function ssGet(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function ssSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

export function gatesOK(pdpOpen: boolean, cartOpen: boolean) {
  if (ssGet("asa_shown")) return false;
  if (lsGet("asa_sub")) return false;
  const ts = +(lsGet("asa_dismiss") || 0);
  if (ts && Date.now() - ts < 7 * 864e5) return false;
  if (pdpOpen || cartOpen) return false;
  return true;
}

export const useShop = create<ShopState>((set, get) => ({
  cart: [],
  pdp: null,
  pdpOpen: false,
  pdpView: 0,
  selSize: null,
  liked: false,
  cartOpen: false,
  toast: null,
  sheetOpen: false,
  activities: [],
  hydrated: false,
  offline: typeof navigator !== "undefined" ? !navigator.onLine : false,
  shakeChips: 0,

  setHydrated: (hydrated) => set({ hydrated }),
  setOffline: (offline) => set({ offline }),
  recordActivity: (label) =>
    set((state) => ({
      activities: [{ id: `${Date.now()}-${Math.random()}`, label, createdAt: Date.now() }, ...state.activities].slice(0, 20),
    })),
  clearActivities: () => set({ activities: [] }),
  resetDemo: () => {
    try {
      localStorage.removeItem("asa_shop_state_v1");
      localStorage.removeItem("asa_sub");
      localStorage.removeItem("asa_dismiss");
      sessionStorage.removeItem("asa_shown");
    } catch {
      /* private mode */
    }
    set({ cart: [], activities: [], liked: false, sheetOpen: false, cartOpen: false, pdpOpen: false });
    get().showToast("DEMO STATE RESET");
  },

  openPDP: (p) => {
    set({ pdp: p, pdpOpen: true, pdpView: 0, selSize: null, liked: false });
    get().recordActivity(`VIEWED ${p.sku}`);
    track("pdp_view", { sku: p.sku });
  },
  closePDP: () => set({ pdpOpen: false }),
  setPdpView: (v) => set({ pdpView: v }),
  setSize: (s) => set({ selSize: s }),
  toggleLike: () => {
    const next = !get().liked;
    set({ liked: next });
    get().recordActivity(next ? "SAVED ITEM TO LIKES" : "REMOVED ITEM FROM LIKES");
    get().showToast(next ? "SAVED TO LIKES" : "REMOVED FROM LIKES");
  },
  addToBag: () => {
    const { pdp, selSize } = get();
    if (!pdp) return;
    if (selSize == null) {
      set({ shakeChips: get().shakeChips + 1 });
      get().showToast("SELECT A SIZE FIRST");
      return;
    }
    set({
      cart: [
        ...get().cart,
        {
          sku: pdp.sku,
          name: pdp.name,
          price: pdp.price,
          size: selSize,
          art: pdp.art,
        },
      ],
      pdpOpen: false,
      selSize: null,
      pdpView: 0,
    });
    get().recordActivity(`${pdp.sku} · SIZE ${selSize} ADDED TO BAG`);
    get().showToast(`${pdp.sku} · SIZE ${selSize} ADDED TO BAG`);
    track("add_to_bag", { sku: pdp.sku, size: selSize });
  },
  openCart: () => {
    set({ cartOpen: true });
    get().recordActivity("OPENED SHOPPING BAG");
  },
  closeCart: () => set({ cartOpen: false }),
  removeCart: (index) => {
    const item = get().cart[index];
    set({ cart: get().cart.filter((_, i) => i !== index) });
    if (item) get().recordActivity(`REMOVED ${item.sku} FROM BAG`);
  },
  checkout: () => {
    get().recordActivity("CHECKOUT PREVIEWED OFFLINE");
    get().showToast("CHECKOUT — DEMO ONLY");
  },
  showToast: (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: null }), 2600);
  },
  openSheet: (reason) => {
    if (lsGet("asa_sub")) return false;
    ssSet("asa_shown", "1");
    set({ sheetOpen: true });
    track("sms_prompt_shown", { trigger: reason });
    return true;
  },
  closeSheet: (method, dismissed) => {
    const wasOpen = get().sheetOpen;
    set({ sheetOpen: false });
    if (dismissed) lsSet("asa_dismiss", String(Date.now()));
    if (wasOpen) track("sms_dismissed", { method });
  },
  findSimilar: (p) => {
    const cat =
      p.cat === "skirts"
        ? "SKIRTS"
        : p.cat === "trousers"
          ? "TROUSERS"
          : p.cat === "gown"
            ? "MAMIWATA GOWN"
            : "TENNIS SKIRTS";
    get().recordActivity(`FOUND SIMILAR ${p.sku}`);
    get().showToast(`SCANNING ${p.sku} — 4 MATCHES IN ${cat}`);
  },
}));

const PERSISTED_KEY = "asa_shop_state_v1";

export function hydrateShop() {
  try {
    const raw = localStorage.getItem(PERSISTED_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<ShopState>;
    useShop.setState({
      cart: Array.isArray(parsed.cart) ? parsed.cart.slice(0, 30) : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities.slice(0, 20) : [],
      liked: Boolean(parsed.liked),
      hydrated: true,
    });
  } catch {
    useShop.setState({ hydrated: true });
  }
}

if (typeof window !== "undefined") {
  useShop.subscribe((state) => {
    try {
      localStorage.setItem(PERSISTED_KEY, JSON.stringify({ cart: state.cart, activities: state.activities, liked: state.liked }));
    } catch {
      /* private mode or storage quota */
    }
  });
}
