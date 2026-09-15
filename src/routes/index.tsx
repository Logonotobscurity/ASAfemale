import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BrandIntro } from "@/components/shop/brand-intro";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();

  return <BrandIntro onEnter={() => navigate({ to: "/store" })} />;
}
