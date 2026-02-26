export function CoordinatorOctopusSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {[200, 230, 260, 290, 320].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(rad) * 18;
        const y1 = 58 + Math.sin(rad) * 14;
        const x2 = 50 + Math.cos(rad) * 38;
        const y2 = 58 + Math.sin(rad) * 35;
        return (
          <path key={i}
            d={`M ${x1} ${y1} Q ${50 + Math.cos(rad) * 28} ${58 + Math.sin(rad) * 28}, ${x2} ${y2}`}
            fill="none" stroke="#4db6ac" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"
            style={{ animation: `float ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
        );
      })}
      <ellipse cx="50" cy="42" rx="22" ry="26" fill="url(#coord-grad)" />
      <circle cx="42" cy="38" r="4" fill="white" />
      <circle cx="58" cy="38" r="4" fill="white" />
      <circle cx="43" cy="38" r="2.2" fill="#0a1628" />
      <circle cx="59" cy="38" r="2.2" fill="#0a1628" />
      <path d="M 43 48 Q 50 55, 57 48" fill="none" stroke="#0a1628" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="6" y="60" width="18" height="24" rx="2" fill="#1e293b" stroke="#4db6ac" strokeWidth="1" />
      <line x1="10" y1="66" x2="20" y2="66" stroke="#4db6ac" strokeWidth="0.5" opacity="0.5" />
      <line x1="10" y1="70" x2="18" y2="70" stroke="#4db6ac" strokeWidth="0.5" opacity="0.5" />
      <line x1="10" y1="74" x2="20" y2="74" stroke="#4db6ac" strokeWidth="0.5" opacity="0.5" />
      <line x1="10" y1="78" x2="16" y2="78" stroke="#4db6ac" strokeWidth="0.5" opacity="0.5" />
      <g transform="rotate(-30 95 55)">
        <rect x="88" y="48" width="3" height="22" rx="0.5" fill="#f59e0b" />
        <polygon points="88,70 89.5,76 91,70" fill="#1e293b" />
        <rect x="88" y="48" width="3" height="3" fill="#ec4899" />
      </g>
      <defs>
        <linearGradient id="coord-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009688" />
          <stop offset="100%" stopColor="#00796b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
