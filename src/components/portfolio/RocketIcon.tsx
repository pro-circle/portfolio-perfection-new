type RocketIconProps = {
  size?: number;
  idPrefix?: string;
  className?: string;
};

/** 3D-styled rocket pointing to +X (right). Rotate the wrapper to aim it. */
const RocketIcon = ({ size = 38, idPrefix = "rc", className }: RocketIconProps) => {
  const id = (name: string) => `${idPrefix}-${name}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id={id("body")} x1="0" y1="18" x2="0" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#f2f5f8" />
          <stop offset="1" stopColor="#b8c2cc" />
        </linearGradient>
        <linearGradient id={id("fin")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4aa8ff" />
          <stop offset="1" stopColor="#0e6fd6" />
        </linearGradient>
        <linearGradient id={id("nozzle")} x1="0" y1="20" x2="0" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6b7480" />
          <stop offset="1" stopColor="#2b3138" />
        </linearGradient>
        <radialGradient id={id("glass")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#bfeaff" />
          <stop offset="1" stopColor="#0f9ede" />
        </radialGradient>
      </defs>

      {/* fins */}
      <path d="M26 30 L14 14 L14 28 Z" fill={`url(#${id("fin")})`} />
      <path d="M26 34 L14 50 L14 36 Z" fill={`url(#${id("fin")})`} />

      {/* nozzle */}
      <path d="M12 27 h10 v10 h-10 a3 3 0 0 1 0 -10 Z" fill={`url(#${id("nozzle")})`} />

      {/* body */}
      <path
        d="M20 24 h20 c10 0 18 4 22 8 -4 4 -12 8 -22 8 H20 c-3 0 -5 -3 -5 -8 s2 -8 5 -8 Z"
        fill={`url(#${id("body")})`}
      />
      <path
        d="M21 26 h19 c8 0 15 3 19 6 -1 0 -3 -1 -5 -1 -6 -2 -10 -3 -15 -3 H21 Z"
        fill="#ffffff"
        opacity="0.75"
      />
      <path d="M22 37 h20 c6 0 11 -1 15 -3 -4 3 -11 5 -18 5 H22 Z" fill="#8f9aa6" opacity="0.6" />

      {/* window */}
      <circle cx="38" cy="32" r="6" fill="#3a4450" />
      <circle cx="38" cy="32" r="4.4" fill={`url(#${id("glass")})`} />
      <circle cx="36.4" cy="30.4" r="1.3" fill="#ffffff" opacity="0.85" />

      {/* nose cone at the tip */}
      <path
        d="M48 26.4 c8 1.6 13 4.4 14 5.6 -1 1.2 -6 4 -14 5.6 c3 -2 4.4 -3.8 4.4 -5.6 s-1.4 -3.6 -4.4 -5.6 Z"
        fill={`url(#${id("fin")})`}
      />
    </svg>
  );
};

export default RocketIcon;
