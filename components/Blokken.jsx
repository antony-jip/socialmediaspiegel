import Link from 'next/link';
import { STAPPEN } from '@/lib/inhoud';

export function Stappen() {
  return (
    <section className="stappen" id="stappen">
      <h2>Van ontwerp tot aan je muur</h2>
      <ol>
        {STAPPEN.map(([kop, tekst]) => (
          <li key={kop}><h3>{kop}</h3><p>{tekst}</p></li>
        ))}
      </ol>
    </section>
  );
}

export function Paginakop({ label, titel, lead, kleur = 'lila' }) {
  return (
    <section className={`paginakop paginakop--${kleur}`}>
      {label && <span className="paginakop__label">{label}</span>}
      <h1>{titel}</h1>
      {lead && <p>{lead}</p>}
    </section>
  );
}

export function Slotblok() {
  return (
    <section className="slotblok">
      <h2>Klaar om gepost te worden?</h2>
      <p>Ontwerp je spiegel in twee minuten. Je krijgt eerst een digitale proef, en we maken hem pas na jouw akkoord.</p>
      <Link className="knop knop--framboos knop--groot" href="/ontwerpen">Ontwerp de jouwe</Link>
    </section>
  );
}
