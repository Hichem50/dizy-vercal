import { COVER } from "@/lib/data";
import { IC } from "@/lib/icons";
import { CATS } from "@/lib/data";

export function Cover({ cat, h = 150 }: { cat: number; h?: number }) {
  const [a, b] = COVER[cat] ?? COVER[0];
  const id = `g${cat}-${h}`;
  const ikey = CATS[cat]?.icon ?? "box";
  return (
    <div className="cover" style={{ height: h }} aria-hidden="true">
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
        <rect width="320" height="180" fill={`url(#${id})`} />
        <circle cx="280" cy="20" r="80" fill="#fff" opacity=".13" />
        <circle cx="30" cy="180" r="70" fill="#000" opacity=".07" />
        <rect x="118" y="52" width="84" height="70" rx="16" fill="#fff" />
        <g transform="translate(142 69) scale(1.5)" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={IC[ikey]} />
        </g>
      </svg>
    </div>
  );
}
