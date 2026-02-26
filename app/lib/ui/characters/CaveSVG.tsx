export function CaveSVG({ className = "", label = "" }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden="true">
      <path d="M 0 100 L 20 30 Q 40 5, 80 0 Q 120 5, 140 30 L 160 100 Z" fill="#1e293b" />
      <ellipse cx="80" cy="90" rx="35" ry="28" fill="#0a1628" />
      <ellipse cx="80" cy="88" rx="25" ry="20" fill="#060d1a" />
      <polygon points="60,62 63,75 66,62" fill="#263238" />
      <polygon points="78,60 80,70 82,60" fill="#263238" />
      <polygon points="94,62 97,72 100,62" fill="#263238" />
      <path d="M 20 30 Q 40 22, 60 25 Q 80 18, 100 25 Q 120 20, 140 30" fill="none" stroke="#bae6fd" strokeWidth="3" opacity="0.4" />
      {label && (
        <text x="80" y="20" textAnchor="middle" fill="#4db6ac" fontSize="8" fontWeight="bold" opacity="0.7">
          {label}
        </text>
      )}
    </svg>
  );
}
