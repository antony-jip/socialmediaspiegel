// Merk: "spiegel" met zijn eigen weerspiegeling eronder. Beeldmerk: een s en zijn spiegelbeeld.
export function Beeldmerk({ className = '' }) {
  return (
    <svg className={`beeldmerk ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="bm-weerkaatsing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--inkt)" stopOpacity="0.28" />
          <stop offset="0.8" stopColor="var(--inkt)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="6" y="3" width="36" height="42" rx="12" fill="var(--lila)" />
      <line x1="11" y1="25.5" x2="37" y2="25.5" stroke="var(--inkt)" strokeOpacity="0.18" strokeWidth="1" />
      <text x="24" y="24" textAnchor="middle" fill="var(--inkt)" fontFamily="var(--f-display), serif" fontSize="25">s</text>
      <text x="24" y="24" textAnchor="middle" fill="url(#bm-weerkaatsing)" fontFamily="var(--f-display), serif" fontSize="25" transform="translate(0 51) scale(1 -1)">s</text>
    </svg>
  );
}

export function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <Beeldmerk />
      <span className="logo__woord">socialmedia<span className="logo__spiegel" data-t="spiegel">spiegel</span></span>
    </span>
  );
}
