// Zo makkelijk mogelijk: de rail zit al op de spiegel, of de tape zit er al op. Elke stap met een illustratie.
const INKT = '#231b33';
const Muur = () => <rect x="0" y="0" width="200" height="140" rx="14" fill="#f3eefb" />;

const Illustraties = {
  // 1. muurrail vastschroeven, met waterpasje
  railMuur: (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <Muur />
      <rect x="36" y="56" width="128" height="14" rx="3" fill="#d4d9e0" stroke={INKT} strokeWidth="2" />
      <rect x="90" y="59" width="20" height="8" rx="4" fill="#bfe8d5" stroke={INKT} strokeWidth="1.5" />
      <circle cx="101" cy="63" r="2.2" fill="#fff" stroke={INKT} strokeWidth="1" />
      <circle cx="52" cy="63" r="3.4" fill={INKT} />
      <circle cx="148" cy="63" r="3.4" fill={INKT} />
      <path d="M148 63 L170 88" stroke={INKT} strokeWidth="2" strokeLinecap="round" />
      <rect x="164" y="86" width="26" height="14" rx="4" transform="rotate(48 177 93)" fill="#e23b7e" stroke={INKT} strokeWidth="2" />
      <text x="36" y="44" fontSize="11" fontWeight="700" fill={INKT} fontFamily="sans-serif">2 schroeven</text>
    </svg>
  ),
  // 2. zijaanzicht: rail op de spiegel haakt in de muurrail
  railHaak: (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <Muur />
      <rect x="150" y="10" width="40" height="120" fill="#e6ddfb" />
      <line x1="150" y1="10" x2="150" y2="130" stroke={INKT} strokeWidth="2" />
      <path d="M150 52 H128 V40" fill="none" stroke="#8d949e" strokeWidth="5" strokeLinejoin="round" />
      <rect x="92" y="22" width="12" height="104" rx="3" fill="#fff" stroke={INKT} strokeWidth="2" />
      <rect x="92" y="22" width="3" height="104" fill="#e23b7e" />
      <path d="M104 30 H134 V44" fill="none" stroke="#5f6670" strokeWidth="5" strokeLinejoin="round" />
      <rect x="104" y="112" width="46" height="8" rx="2" fill="#5f6670" />
      <path d="M70 34 V64 M62 56 L70 66 L78 56" fill="none" stroke="#e23b7e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="40" y="102" fontSize="10.5" fontWeight="700" fill={INKT} fontFamily="sans-serif">haakt</text>
      <text x="40" y="114" fontSize="10.5" fontWeight="700" fill={INKT} fontFamily="sans-serif">erin</text>
    </svg>
  ),
  // 3. hangt recht, met gloed; borgschroefje onderaan
  railKlaar: (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <Muur />
      <rect x="72" y="14" width="56" height="108" rx="14" fill="#ffd9a8" opacity="0.55" filter="url(#zacht)" />
      <defs><filter id="zacht"><feGaussianBlur stdDeviation="7" /></filter></defs>
      <rect x="76" y="18" width="48" height="100" rx="11" fill="#fff" stroke="#17131f" strokeWidth="3" />
      <rect x="82" y="34" width="36" height="66" rx="2" fill="#dde2e9" />
      <path d="M86 90 L104 40 M94 96 L112 50" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <rect x="93" y="23" width="14" height="4" rx="2" fill="#17131f" />
      <circle cx="100" cy="128" r="4" fill={INKT} />
      <path d="M112 128 a12 12 0 0 0 -6 -10" fill="none" stroke="#e23b7e" strokeWidth="2" strokeLinecap="round" />
      <path d="M150 60 l8 8 l16 -18" fill="none" stroke="#1f9d6b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // plak-klaar 1: muur schoonmaken
  plakSchoon: (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <Muur />
      <rect x="70" y="52" width="52" height="34" rx="8" fill="#bfe8d5" stroke={INKT} strokeWidth="2" transform="rotate(-10 96 69)" />
      <path d="M48 44 q10 -8 20 0 M44 60 q10 -8 20 0 M136 88 q10 -8 20 0" fill="none" stroke="#8d949e" strokeWidth="2" strokeLinecap="round" />
      <path d="M150 34 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill="#fbe7a1" stroke={INKT} strokeWidth="1.5" />
      <path d="M40 98 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#fbe7a1" stroke={INKT} strokeWidth="1.2" />
    </svg>
  ),
  // plak-klaar 2: achterkant met tape, folie eraf
  plakFolie: (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <Muur />
      <rect x="70" y="12" width="60" height="116" rx="14" fill="#ece8f3" stroke={INKT} strokeWidth="2" />
      {[30, 52, 74, 96].map((y) => <rect key={y} x="80" y={y} width="40" height="10" rx="2" fill="#f6c9d8" stroke={INKT} strokeWidth="1.2" />)}
      <path d="M120 96 L138 84 L132 104 Z" fill="#fff" stroke={INKT} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M140 80 q14 -10 24 -2" fill="none" stroke="#e23b7e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M160 74 l6 4 l-7 3" fill="none" stroke="#e23b7e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // plak-klaar 3: tegen de muur drukken
  plakDruk: (
    <svg viewBox="0 0 200 140" aria-hidden="true">
      <Muur />
      <rect x="72" y="16" width="56" height="108" rx="13" fill="#fff" stroke="#17131f" strokeWidth="3" />
      <rect x="79" y="32" width="42" height="72" rx="2" fill="#dde2e9" />
      <path d="M40 50 H62 M54 42 L63 50 L54 58 M40 90 H62 M54 82 L63 90 L54 98" fill="none" stroke="#e23b7e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="160" cy="44" r="16" fill="#fff" stroke={INKT} strokeWidth="2" />
      <path d="M160 34 V44 L167 49" fill="none" stroke={INKT} strokeWidth="2" strokeLinecap="round" />
      <text x="144" y="78" fontSize="11" fontWeight="700" fill={INKT} fontFamily="sans-serif">24 uur</text>
    </svg>
  ),
};

const RAIL = [
  ['railMuur', 'Schroef de muurrail vast', 'Houd hem waar de bovenkant moet komen, zo’n 1,85 m hoog. Het waterpasje laat zien of hij recht zit. Twee gaten, pluggen erin, vastschroeven.'],
  ['railHaak', 'Hang hem erop', 'Laat de spiegel over de muurrail zakken. De rail achterop haakt erin en hij hangt meteen recht.'],
  ['railKlaar', 'Klaar', 'Wil je hem muurvast? Draai onderaan het borgschroefje in. Met Glow steek je de stekker erin.'],
];
const PLAK = [
  ['plakSchoon', 'Maak de muur schoon', 'Stofvrij, droog en vetvrij. Niet op verse verf, behang of kalkverf.'],
  ['plakFolie', 'Folie eraf', 'De tape zit al op de achterkant. Trek de beschermfolie eraf.'],
  ['plakDruk', 'Druk hem aan', 'Recht tegen de muur, een halve minuut stevig aandrukken. Na 24 uur zit hij vast.'],
];

function Manier({ titel, uitleg, stappen }) {
  return (
    <div className="ophangen__manier">
      <h3>{titel}</h3>
      <p>{uitleg}</p>
      <ol className="ophangen__stappen">
        {stappen.map(([beeld, kop, tekst]) => (
          <li key={kop}>
            <span className="ophangen__beeld">{Illustraties[beeld]}</span>
            <b>{kop}</b>
            <span>{tekst}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Ophangen({ titel = 'Ophangen in drie stappen' }) {
  return (
    <section className="ophangen" id="ophangen">
      <div className="ophangen__kop">
        <span className="label">Ophangen</span>
        <h2>{titel}</h2>
        <p>Alles zit in de doos: de rail met waterpasje, schroeven, pluggen en een boortje. Liever niet boren? Kies plak-klaar.</p>
      </div>
      <div className="ophangen__raster">
        <Manier titel="Met de ophangrail" uitleg="Standaard inbegrepen. De rail zit al op de spiegel, 4 cm van de muur, zodat Glow een gloed rondom geeft." stappen={RAIL} />
        <Manier titel="Plak-klaar · + € 15" uitleg="De tape zit er al op, je hoeft niets te boren. Plat tegen de muur, dus zonder Glow." stappen={PLAK} />
      </div>
    </section>
  );
}
