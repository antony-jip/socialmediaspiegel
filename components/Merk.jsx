// Merk: "spiegel" als schuin story-blok met een glinster, zoals licht op een spiegel. Slogan: "Word gepost."
export function Ster({ kleur = 'var(--geel)', className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0z" fill={kleur} />
    </svg>
  );
}

export function Beeldmerk({ className = '' }) {
  return (
    <svg className={`beeldmerk ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="7" width="36" height="36" rx="10" fill="var(--roze)" transform="rotate(-6 23 25)" />
      <text x="23" y="34" textAnchor="middle" fill="#fff" fontFamily="var(--f-display), sans-serif" fontWeight="800" fontSize="27" transform="rotate(-6 23 25)">s</text>
      <path d="M40 1.5c.5 3.8 3.3 6.6 7 7.1-3.7.5-6.5 3.3-7 7.1-.5-3.8-3.3-6.6-7-7.1 3.7-.5 6.5-3.3 7-7.1z" fill="var(--geel)" />
    </svg>
  );
}

export function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo__social">socialmedia</span>
      <span className="logo__spiegel">
        spiegel
        <Ster className="logo__ster" />
      </span>
    </span>
  );
}

// De glansstrepen van de spiegel, als terugkerend grafisch element.
export function Glans({ className = '' }) {
  return (
    <svg className={`glans ${className}`} viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 170 150 -20M30 220 220 30" stroke="currentColor" strokeWidth="22" strokeLinecap="round" />
    </svg>
  );
}

const Hart = ({ kleur }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-7.8-4.8-9.5-9.8C1.3 7.6 3.7 4.3 7.2 4.3c2 0 3.7 1.1 4.8 2.8 1.1-1.7 2.8-2.8 4.8-2.8 3.5 0 5.9 3.3 4.7 6.9C19.8 16.2 12 21 12 21z" fill={kleur} />
  </svg>
);
const At = ({ kleur }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16.5 12a4.5 4.5 0 1 1-1.3-3.2M16.5 8v5.2c0 1.6 1 2.6 2.3 2.6 1.9 0 2.7-2 2.7-3.8a9.5 9.5 0 1 0-4 7.7" fill="none" stroke={kleur} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);
const Rondje = ({ kleur }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill={kleur} /></svg>
);
const Ring = ({ kleur }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke={kleur} strokeWidth="3.5" /></svg>
);

const VORMEN = { ster: Ster, hart: Hart, at: At, rondje: Rondje, ring: Ring };

// items: [vorm, kleur, x%, y%, grootte px, draai]
export function Decor({ items }) {
  return (
    <div className="decor" aria-hidden="true">
      {items.map(([vorm, kleur, x, y, maat, draai = 0], i) => {
        const V = VORMEN[vorm];
        return (
          <span key={i} className="decor__stuk" style={{ left: `${x}%`, top: `${y}%`, width: maat, height: maat, '--draai': `${draai}deg`, '--vertraging': `${(i % 5) * -1.3}s` }}>
            <V kleur={kleur} />
          </span>
        );
      })}
    </div>
  );
}
