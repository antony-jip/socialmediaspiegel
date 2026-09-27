// Merk: de naam spiegelt zichzelf. Beeldmerk: een s en zijn spiegelbeeld aan weerszijden van een spiegellijn.
export function Beeldmerk({ className = '' }) {
  // Spiegel in telefoonvorm met glinstering, rechtsboven een like-melding.
  return (
    <svg className={`beeldmerk ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="6" width="30" height="40" rx="9" fill="var(--framboos)" />
      <rect x="10.5" y="11" width="21" height="28" rx="4.5" fill="#ffc4dc" />
      <path d="M14.5 25 23.5 14M17.5 32 28.5 18.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="37" cy="11" r="10.5" fill="var(--merk-rand, #fcfaff)" />
      <circle cx="37" cy="11" r="8" fill="var(--inkt)" />
      <path d="M12 21s-7.8-4.8-9.5-9.8C1.3 7.6 3.7 4.3 7.2 4.3c2 0 3.7 1.1 4.8 2.8 1.1-1.7 2.8-2.8 4.8-2.8 3.5 0 5.9 3.3 4.7 6.9C19.8 16.2 12 21 12 21z" fill="#fff" transform="translate(32 5.9) scale(0.42)" />
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
