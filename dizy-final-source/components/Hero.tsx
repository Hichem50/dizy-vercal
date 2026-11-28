export function HeroArt() {
  return (
    <svg className="hs" viewBox="0 0 420 320" aria-hidden="true">
      <ellipse cx="215" cy="296" rx="160" ry="14" fill="#15173a" opacity=".1" />
      <g transform="rotate(-11 140 170)">
        <rect x="62" y="76" width="150" height="196" rx="18" fill="#15173a" />
        <rect x="82" y="98" width="110" height="74" rx="10" fill="#3A4152" />
        <path d="M98 156l22-28 16 18 12-12 26 22z" fill="#fb5e12" opacity=".8" />
        <rect x="82" y="188" width="84" height="10" rx="5" fill="#4A5368" />
        <rect x="82" y="236" width="50" height="18" rx="9" fill="#fb5e12" />
      </g>
      <g transform="rotate(8 300 160)">
        <rect x="222" y="62" width="150" height="196" rx="18" fill="#fff" stroke="#ECEDF1" strokeWidth="2" />
        <rect x="242" y="84" width="110" height="74" rx="10" fill="#ffe0cc" />
        <text x="297" y="134" textAnchor="middle" fontFamily="Noto Sans Arabic,Inter,sans-serif" fontSize="34" fontWeight="700" fill="#c7430a">Aa</text>
        <rect x="242" y="174" width="84" height="10" rx="5" fill="#ECEDF1" />
        <rect x="242" y="222" width="50" height="18" rx="9" fill="#15173a" />
      </g>
      <g>
        <rect x="138" y="40" width="160" height="214" rx="22" fill="#fb5e12" />
        <rect x="138" y="40" width="160" height="6" rx="3" fill="#ff9a52" />
        <rect x="158" y="62" width="120" height="88" rx="14" fill="#fff" />
        <path d="M200 82h26l14 14v36h-40z" fill="#fff2ea" stroke="#fb5e12" strokeWidth="4" strokeLinejoin="round" />
        <path d="M226 82v14h14" fill="none" stroke="#fb5e12" strokeWidth="4" strokeLinejoin="round" />
        <rect x="158" y="166" width="96" height="12" rx="6" fill="#15173a" />
        <rect x="158" y="188" width="64" height="10" rx="5" fill="#fff" opacity=".75" />
        <circle cx="264" cy="222" r="22" fill="#15173a" />
        <path d="M264 210v20M255 222l9 9 9-9" stroke="#fb5e12" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
