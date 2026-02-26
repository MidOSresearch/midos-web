export function WrenchPenguinSVG({ className = "" }: { className?: string }) {
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
      <rect x="50" y="30" width="3" height="24" rx="1" fill="#94a3b8" transform="rotate(20 51 42)" />
      <circle cx="52" cy="28" r="6" fill="none" stroke="#94a3b8" strokeWidth="3" transform="rotate(20 51 42)" />
      <rect x="49" y="52" width="7" height="4" rx="1" fill="#94a3b8" transform="rotate(20 51 42)" />
      <ellipse cx="48" cy="46" rx="5" ry="14" fill="#1a2940" transform="rotate(20 48 46)" />
      <ellipse cx="12" cy="48" rx="5" ry="14" fill="#1a2940" transform="rotate(-10 12 48)" />
    </svg>
  );
}
