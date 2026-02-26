export function SledPenguinSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 90" className={className} aria-hidden="true">
      <path d="M 15 75 Q 20 82, 30 82 L 80 82 Q 90 82, 92 75" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="70" x2="30" y2="82" stroke="#f59e0b" strokeWidth="2" />
      <line x1="70" y1="70" x2="70" y2="82" stroke="#f59e0b" strokeWidth="2" />
      <g transform="translate(35, -2)">
        <ellipse cx="18" cy="48" rx="14" ry="22" fill="#1a2940" />
        <ellipse cx="18" cy="51" rx="9" ry="15" fill="#e0f2f1" />
        <circle cx="18" cy="28" r="11" fill="#1a2940" />
        <circle cx="13" cy="26" r="2" fill="white" />
        <circle cx="23" cy="26" r="2" fill="white" />
        <circle cx="13.7" cy="26" r="1" fill="#0a1628" />
        <circle cx="23.7" cy="26" r="1" fill="#0a1628" />
        <polygon points="15,30 21,30 18,34" fill="#f59e0b" />
      </g>
      <g transform="translate(46, 2)">
        {[150, 180, 210, 250, 290, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 7 + Math.cos(rad) * 5;
          const y1 = 10 + Math.sin(rad) * 4;
          const x2 = 7 + Math.cos(rad) * 12;
          const y2 = 10 + Math.sin(rad) * 10;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#4db6ac" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: `float ${1.5 + i * 0.2}s ease-in-out infinite` }} />
          );
        })}
        <ellipse cx="7" cy="6" rx="7" ry="8" fill="#009688" />
        <circle cx="4" cy="4" r="1.5" fill="white" />
        <circle cx="10" cy="4" r="1.5" fill="white" />
        <circle cx="4.5" cy="4" r="0.8" fill="#0a1628" />
        <circle cx="10.5" cy="4" r="0.8" fill="#0a1628" />
      </g>
    </svg>
  );
}
