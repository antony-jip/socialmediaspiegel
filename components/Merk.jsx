// Merk: de naam spiegelt zichzelf. Beeldmerk: een s en zijn spiegelbeeld aan weerszijden van een spiegellijn.
export function Beeldmerk({ className = '' }) {
  return (
    <svg className={`beeldmerk ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="7" y="2.5" width="34" height="43" rx="11" fill="var(--merk-vlak, var(--framboos))" />
      <line x1="24" y1="9" x2="24" y2="39" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" />
      <text x="25.4" y="31.8" fill="#fff" fontFamily="var(--f-merk), sans-serif" fontWeight="800" fontSize="25">s</text>
      <text x="25.4" y="31.8" fill="#fff" fillOpacity="0.42" fontFamily="var(--f-merk), sans-serif" fontWeight="800" fontSize="25" transform="translate(48 0) scale(-1 1)">s</text>
    </svg>
  );
}

export function Logo({ className = '', echo = true }) {
  return (
    <span className={`logo ${className}`}>
      <Beeldmerk />
      <span className="logo__woord">
        socialmedia<b>spiegel</b>
        {echo && <span className="logo__echo" aria-hidden="true"><i />spiegel</span>}
      </span>
    </span>
  );
}
