// Doorsnede van de rand, naar de werktekening (schaal 4 px per mm). Voorkant boven, muur onder.
const DELEN = [
  ['glas', 'Spiegelglas 4 mm met veiligheidsfolie'],
  ['boven', 'Bovenplaat met folie in jouw kleur'],
  ['onder', 'Onderplaat Dibond 3 mm'],
  ['rand', 'Zwarte rubberen rand rondom'],
  ['koker', 'Aluminium koker, houdt hem van de muur'],
  ['led', 'Glow: LED-strip rondom (optie)'],
];

export default function Doorsnede() {
  return (
    <figure className="doorsnede">
      <svg viewBox="0 0 560 290" role="img" aria-label="Doorsnede van de rand van de spiegel">
        <defs>
          <pattern id="ds-muur" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#cbbfe6" strokeWidth="2" />
          </pattern>
          <linearGradient id="ds-gloed" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffb86b" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffb86b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M252 150 L10 238 L150 238 L252 176 Z" fill="url(#ds-gloed)" />
        <rect className="ds-glas" x="140" y="40" width="400" height="16" rx="1" />
        <rect className="ds-boven" x="20" y="40" width="118" height="16" rx="1" />
        <rect className="ds-onder" x="20" y="60" width="520" height="12" rx="1" />
        <path className="ds-rand" d="M12 34 H44 V40 H20 V72 H44 V78 H12 Z" />
        <rect className="ds-koker" x="260" y="76" width="80" height="162" rx="2" />
        <rect className="ds-koker-binnen" x="268" y="84" width="64" height="146" rx="1" />
        <rect className="ds-led" x="251" y="136" width="9" height="40" rx="2" />
        <rect x="0" y="238" width="560" height="22" fill="url(#ds-muur)" />
        <line x1="0" y1="238" x2="560" y2="238" stroke="var(--inkt)" strokeWidth="1.5" />
        <g className="ds-maat">
          <line x1="548" y1="40" x2="548" y2="238" />
          <line x1="542" y1="40" x2="554" y2="40" />
          <line x1="542" y1="238" x2="554" y2="238" />
          <text x="540" y="146" textAnchor="end">49 mm</text>
        </g>
        <text className="ds-muurtekst" x="12" y="278">muur</text>
      </svg>
      <figcaption>
        <ul>
          {DELEN.map(([id, tekst]) => <li key={id}><i className={`ds-staal ds-staal--${id}`} />{tekst}</li>)}
        </ul>
      </figcaption>
    </figure>
  );
}
