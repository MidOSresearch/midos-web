export function PenguinSVG({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 80" className={className} style={style} aria-hidden="true">
      <ellipse cx="30" cy="48" rx="20" ry="28" fill="#1a2940" />
      <ellipse cx="30" cy="52" rx="13" ry="20" fill="#e0f2f1" />
      <circle cx="30" cy="22" r="14" fill="#1a2940" />
      <circle cx="24" cy="20" r="2.5" fill="white" />
      <circle cx="36" cy="20" r="2.5" fill="white" />
      <circle cx="25" cy="20" r="1.2" fill="#0a1628" />
      <circle cx="37" cy="20" r="1.2" fill="#0a1628" />
      <polygon points="27,26 33,26 30,31" fill="#f59e0b" />
      <ellipse cx="22" cy="76" rx="6" ry="3" fill="#f59e0b" />
      <ellipse cx="38" cy="76" rx="6" ry="3" fill="#f59e0b" />
      <ellipse cx="10" cy="45" rx="5" ry="16" fill="#1a2940" transform="rotate(-10 10 45)" />
      <ellipse cx="50" cy="45" rx="5" ry="16" fill="#1a2940" transform="rotate(10 50 45)" />
    </svg>
  );
}
