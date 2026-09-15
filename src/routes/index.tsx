import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BrandIntro } from "@/components/shop/brand-intro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "ÀṢÀ — Wear Your Point of View" }, { property: "og:url", content: "https://asa-female.vercel.app/" }],
    links: [{ rel: "canonical", href: "https://asa-female.vercel.app/" }],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  return <BrandIntro onEnter={() => navigate({ to: "/store" })} />;
}
