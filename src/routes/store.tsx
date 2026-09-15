import { createFileRoute } from "@tanstack/react-router";
import { ShopApp } from "@/components/shop/shop-app";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [{ title: "ÀṢÀ — The Collection" }, { property: "og:url", content: "https://asa-female.vercel.app/store" }],
    links: [{ rel: "canonical", href: "https://asa-female.vercel.app/store" }],
  }),
  component: Storefront,
});

function Storefront() {
  return <ShopApp />;
}
