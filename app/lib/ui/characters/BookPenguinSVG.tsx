export function BookPenguinSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 90" className={className} aria-hidden="true">
      <ellipse cx="30" cy="52" rx="18" ry="26" fill="#1a2940" />
      <ellipse cx="30" cy="55" rx="12" ry="18" fill="#e0f2f1" />
      <circle cx="30" cy="28" r="13" fill="#1a2940" />
      <circle cx="24" cy="26" r="2.2" fill="white" />
      <circle cx="36" cy="26" r="2.2" fill="white" />
      <circle cx="25" cy="26" r="1.1" fill="#0a1628" />
      <circle cx="37" cy="26" r="1.1" fill="#0a1628" />
      <polygon points="27,31 33,31 30,35" fill="#f59e0b" />
      <ellipse cx="22" cy="78" rx="5" ry="2.5" fill="#f59e0b" />
      <ellipse cx="38" cy="78" rx="5" ry="2.5" fill="#f59e0b" />
      <rect x="48" y="38" width="16" height="20" rx="2" fill="#6366f1" transform="rotate(8 56 48)" />
      <rect x="50" y="40" width="12" height="16" rx="1" fill="#818cf8" transform="rotate(8 56 48)" />
      <line x1="52" y1="44" x2="60" y2="44" stroke="#c7d2fe" strokeWidth="1" transform="rotate(8 56 48)" />
      <line x1="52" y1="48" x2="58" y2="48" stroke="#c7d2fe" strokeWidth="1" transform="rotate(8 56 48)" />
      <ellipse cx="48" cy="48" rx="5" ry="14" fill="#1a2940" transform="rotate(15 48 48)" />
      <ellipse cx="12" cy="48" rx="5" ry="14" fill="#1a2940" transform="rotate(-10 12 48)" />
    </svg>
  );
}
