import type { ArtId } from "@/lib/catalog";

const INK = "var(--ink)";
const CANVAS = "var(--canvas)";

function Body({ d }: { d: string }) {
  return <path d={d} fill={INK} />;
}
function Line({ d }: { d: string }) {
  return <path d={d} stroke={CANVAS} strokeWidth="1.1" fill="none" />;
}

function EmbDots() {
  const dots: { x: number; y: number }[] = [];
  for (let y = 14; y <= 46; y += 6) {
    for (let x = 43; x <= 57; x += 4) dots.push({ x, y });
  }
  return (
    <>
      {dots.map((p) => (
        <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="0.9" fill={CANVAS} />
      ))}
    </>
  );
}

function ArtInner({ art }: { art: ArtId }) {
  switch (art) {
    case "aline":
      return (
        <>
          <Body d="M38 12 H62 L63 16 H37 Z" />
          <Body d="M37 16 H63 L75 92 Q62 100 50 94 Q38 100 25 92 Z" />
        </>
      );
    case "wrap":
      return (
        <>
          <Body d="M38 14 H62 L63 18 H37 Z" />
          <Body d="M37 18 H63 L70 64 Q50 72 30 64 Z" />
          <Line d="M40 20 L62 60" />
        </>
      );
    case "slip":
      return (
        <>
          <Body d="M40 10 H60 L61 13 H39 Z" />
          <Body d="M39 13 H61 L66 90 Q50 97 34 90 Z" />
          <Line d="M44 16 L42 86" />
        </>
      );
    case "wide":
      return (
        <>
          <Body d="M36 8 H64 L64.5 13 H35.5 Z" />
          <Body d="M36 13 H49 L48 106 H28 Z" />
          <Body d="M51 13 H64 L72 106 H52 Z" />
        </>
      );
    case "cargo":
      return (
        <>
          <Body d="M36 8 H64 L64.5 13 H35.5 Z" />
          <Body d="M36 13 H49 L48 106 H28 Z" />
          <Body d="M51 13 H64 L72 106 H52 Z" />
          <rect x="30" y="50" width="15" height="9" fill={INK} stroke={CANVAS} strokeWidth="1.1" />
          <rect x="55" y="50" width="15" height="9" fill={INK} stroke={CANVAS} strokeWidth="1.1" />
        </>
      );
    case "flare":
      return (
        <>
          <Body d="M38 10 H62 L62.5 14 H37.5 Z" />
          <Body d="M38 14 H49 L47 56 L51 106 H29 L36 56 Z" />
          <Body d="M51 14 H62 L64 56 L71 106 H49 L53 56 Z" />
        </>
      );
    case "mermaid":
    case "meroff":
    case "meremb":
      return (
        <>
          <Body d="M40 8 H60 C62 30 60 45 56 60 C70 78 79 92 84 101 Q50 113 16 101 C21 92 30 78 44 60 C40 45 38 30 40 8 Z" />
          {art === "meroff" ? <Body d="M37 6 H63 L63 10 H37 Z" /> : null}
          {art === "meremb" ? <EmbDots /> : null}
          <Line d="M44 62 C36 74 30 84 26 96" />
          <Line d="M56 62 C64 74 70 84 74 96" />
        </>
      );
    case "pleat":
    case "pleatink":
      return (
        <>
          {art === "pleatink" ? (
            <rect x="36" y="10" width="28" height="5" fill={CANVAS} stroke={INK} strokeWidth="1.2" />
          ) : (
            <rect x="36" y="10" width="28" height="5" fill={INK} />
          )}
          <Body d="M36 15 H64 L77 56 Q50 66 23 56 Z" />
          <Line d="M41 16 L31 58" />
          <Line d="M47 16 L41 61" />
          <Line d="M53 16 L51 62" />
          <Line d="M59 16 L61 61" />
          <Line d="M63 16 L70 58" />
        </>
      );
    case "skort":
      return (
        <>
          <Body d="M36 12 H64 L64.5 16 H35.5 Z" />
          <Body d="M36 16 H64 L73 52 Q50 60 27 52 Z" />
          <Line d="M36 16 L60 46 Q48 52 38 46 Z" />
        </>
      );
  }
}

export function Silhouette({
  art,
  className,
}: {
  art: ArtId;
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 100 125" aria-hidden="true">
      <ArtInner art={art} />
    </svg>
  );
}
