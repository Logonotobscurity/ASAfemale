export type CatId = "skirts" | "trousers" | "gown" | "tennis";

export type ArtId =
  | "aline"
  | "wrap"
  | "slip"
  | "wide"
  | "cargo"
  | "flare"
  | "mermaid"
  | "meroff"
  | "meremb"
  | "pleat"
  | "pleatink"
  | "skort";

export type Photo = {
  src: string;
  srcset?: string;
};

export type Product = {
  sku: string;
  name: string;
  cat: CatId;
  price: number;
  old: number | null;
  sizes: number[];
  art: ArtId;
  focal: string;
  fab: string;
  photo: Photo | null;
};

export type Category = {
  id: CatId;
  label: string;
};

export const CATS: Category[] = [
  { id: "skirts", label: "SKIRTS" },
  { id: "trousers", label: "TROUSERS" },
  { id: "gown", label: "MAMIWATA GOWN" },
  { id: "tennis", label: "TENNIS SKIRTS" },
];

export const PRODUCTS: Product[] = [
  {
    sku: "SK-01",
    name: "A-Line Midi Skirt",
    cat: "skirts",
    price: 12000,
    old: 15000,
    sizes: [6, 8, 10, 12],
    art: "aline",
    focal: "50% 45%",
    fab: "FABRIC: COTTON TWILL, HEAVYWEIGHT",
    photo: null,
  },
  {
    sku: "SK-02",
    name: "Wrap Mini Skirt",
    cat: "skirts",
    price: 9000,
    old: null,
    sizes: [6, 8, 10, 12],
    art: "wrap",
    focal: "50% 50%",
    fab: "FABRIC: MATTE CREPE, TIE BELT",
    photo: null,
  },
  {
    sku: "SK-03",
    name: "Satin Slip Skirt",
    cat: "skirts",
    price: 14000,
    old: 17000,
    sizes: [6, 8, 10, 12],
    art: "slip",
    focal: "50% 50%",
    fab: "FABRIC: BIASED SATIN",
    photo: null,
  },
  {
    sku: "TR-01",
    name: "Croc Wide-Leg Trouser",
    cat: "trousers",
    price: 22000,
    old: null,
    sizes: [26, 28, 30, 32],
    art: "wide",
    focal: "50% 55%",
    fab: "FABRIC: CROC-EMBOSS VEGAN LEATHER",
    photo: null,
  },
  {
    sku: "TR-02",
    name: "Cargo Wide-Leg Trouser",
    cat: "trousers",
    price: 18000,
    old: 21000,
    sizes: [26, 28, 30, 32],
    art: "cargo",
    focal: "50% 50%",
    fab: "FABRIC: 8-WALE CORDUROY",
    photo: null,
  },
  {
    sku: "TR-03",
    name: "Flare Trouser",
    cat: "trousers",
    price: 16000,
    old: null,
    sizes: [26, 28, 30, 32],
    art: "flare",
    focal: "50% 55%",
    fab: "FABRIC: SUITING WOOL BLEND",
    photo: null,
  },
  {
    sku: "MW-01",
    name: "Mamiwata Mermaid Gown",
    cat: "gown",
    price: 48000,
    old: 55000,
    sizes: [6, 8, 10, 12],
    art: "mermaid",
    focal: "50% 40%",
    fab: "FABRIC: STRETCH SCUBA, FISHTAIL HEM",
    photo: null,
  },
  {
    sku: "MW-02",
    name: "Off-Shoulder Mermaid Gown",
    cat: "gown",
    price: 52000,
    old: null,
    sizes: [6, 8, 10, 12],
    art: "meroff",
    focal: "50% 40%",
    fab: "FABRIC: CREPE, OFF-SHOULDER NECK",
    photo: null,
  },
  {
    sku: "MW-03",
    name: "Embellished Mermaid Gown",
    cat: "gown",
    price: 65000,
    old: 72000,
    sizes: [6, 8, 10, 12],
    art: "meremb",
    focal: "50% 40%",
    fab: "FABRIC: BEADED BODICE, TULLE FLARE",
    photo: null,
  },
  {
    sku: "TN-01",
    name: "Press-Pleat Tennis Skirt",
    cat: "tennis",
    price: 10000,
    old: 14000,
    sizes: [6, 8, 10],
    art: "pleat",
    focal: "50% 50%",
    fab: "FABRIC: HEAVYWEIGHT PRESS-PLEAT — MATERIAL IS SUPER THICK",
    photo: null,
  },
  {
    sku: "TN-02",
    name: "Pleat Tennis Skirt, Ink",
    cat: "tennis",
    price: 10000,
    old: null,
    sizes: [6, 8, 10],
    art: "pleatink",
    focal: "50% 50%",
    fab: "FABRIC: PRESS-PLEAT, CONTRAST BAND",
    photo: null,
  },
  {
    sku: "TN-03",
    name: "Pleat Skort, Bone",
    cat: "tennis",
    price: 11000,
    old: 13000,
    sizes: [6, 8, 10],
    art: "skort",
    focal: "50% 50%",
    fab: "FABRIC: PIQUÉ SKORT, BUILT-IN SHORT",
    photo: null,
  },
];

export function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function track(name: string, payload?: Record<string, unknown>) {
  console.log("[analytics]", name, payload ?? {});
}

export function productsIn(cat: CatId) {
  return PRODUCTS.filter((p) => p.cat === cat);
}

export function productBySku(sku: string) {
  return PRODUCTS.find((p) => p.sku === sku);
}

export function categoryById(id: CatId) {
  return CATS.find((c) => c.id === id);
}
