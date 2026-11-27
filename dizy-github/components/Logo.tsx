export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 128 128" aria-hidden="true">
      <defs>
        <linearGradient id="dz-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB547" />
          <stop offset="1" stopColor="#F26B0F" />
        </linearGradient>
        <mask id="dz-m" maskUnits="userSpaceOnUse" x="0" y="0" width="128" height="128">
          <rect width="128" height="128" fill="#fff" />
          <path d="M60 50v30M47 68l13 13 13-13" fill="none" stroke="#000" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </mask>
      </defs>
      <path d="M22 22h46l38 38v12c0 19-15 34-34 34H22z" fill="url(#dz-g)" mask="url(#dz-m)" />
      <path d="M68 22v28a10 10 0 0010 10h28z" fill="#FFE0B0" />
    </svg>
  );
}
