import { createFileRoute } from "@tanstack/react-router";
import { ShopApp } from "@/components/shop/shop-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ShopApp />;
}
