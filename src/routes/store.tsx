import { createFileRoute } from "@tanstack/react-router";
import { ShopApp } from "@/components/shop/shop-app";

export const Route = createFileRoute("/store")({ component: Storefront });

function Storefront() {
  return <ShopApp />;
}
