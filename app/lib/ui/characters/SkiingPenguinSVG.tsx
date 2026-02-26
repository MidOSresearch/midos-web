export function SkiingPenguinSVG({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <rect x="8" y="72" width="30" height="3" rx="1.5" fill="#7dd3fc" transform="rotate(-8 23 73)" />
      <rect x="42" y="72" width="30" height="3" rx="1.5" fill="#7dd3fc" transform="rotate(-8 57 73)" />
      <g transform="rotate(-12 40 50)">
        <ellipse cx="40" cy="48" rx="16" ry="22" fill="#1a2940" />
        <ellipse cx="40" cy="51" rx="10" ry="16" fill="#e0f2f1" />
        <circle cx="40" cy="28" r="11" fill="#1a2940" />
        <circle cx="35" cy="26" r="2" fill="white" />
        <circle cx="45" cy="26" r="2" fill="white" />
        <circle cx="35.7" cy="26" r="1" fill="#0a1628" />
        <circle cx="45.7" cy="26" r="1" fill="#0a1628" />
        <polygon points="37,31 43,31 40,35" fill="#f59e0b" />
      </g>
      <line x1="18" y1="30" x2="10" y2="72" stroke="#bae6fd" strokeWidth="1.5" />
      <line x1="62" y1="30" x2="70" y2="72" stroke="#bae6fd" strokeWidth="1.5" />
    </svg>
  );
}
