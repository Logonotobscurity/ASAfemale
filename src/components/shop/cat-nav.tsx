import { useEffect, useState } from "react";
import { IconSearch } from "@/components/shop/icons";
import { CATS, type CatId } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export function CatNav() {
  const [active, setActive] = useState<CatId>("skirts");
  const showToast = useShop((s) => s.showToast);

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const id = en.target.id.replace("cat-", "") as CatId;
          setActive(id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const c of CATS) {
      const el = document.getElementById("cat-" + c.id);
      if (el) spy.observe(el);
    }
    return () => spy.disconnect();
  }, []);

  return (
    <header className="catnav">
      <nav className="cats" aria-label="Categories">
        {CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={"m" + (active === c.id ? " on" : "")}
            onClick={() =>
              document.getElementById("cat-" + c.id)?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {c.label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        className="searchbtn"
        aria-label="Search"
        onClick={() => showToast("SEARCH — COMING IN DROP 02")}
      >
        <IconSearch />
      </button>
    </header>
  );
}
