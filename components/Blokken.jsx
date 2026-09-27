import Link from 'next/link';
import { Decor, Ster } from '@/components/Merk';
import { STAPPEN, WIE } from '@/lib/inhoud';

export function Band() {
  return (
    <div className="band" aria-label="Voor wie">
      <div className="band__rol">
        {[0, 1].map((k) => (
          <span key={k} aria-hidden={k === 1}>
            {WIE.map((w) => <span key={w}>{w}<Ster className="band__ster" kleur="var(--roze)" /></span>)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stappen() {
  return (
    <section className="stappen" id="stappen">
      <Decor items={[['ster', 'var(--geel)', 92, 10, 40], ['hart', '#fff', 60, 8, 26, -14], ['ring', 'var(--geel)', 3, 80, 34]]} />
      <h2>Van ontwerp tot aan je muur.</h2>
      <ol>
        {STAPPEN.map(([kop, tekst]) => (
          <li key={kop}><h3>{kop}</h3><p>{tekst}</p></li>
        ))}
      </ol>
    </section>
  );
}

export function Paginakop({ sticker, titel, lead, kleur = 'kobalt' }) {
  return (
    <section className={`paginakop paginakop--${kleur}`}>
      <Decor items={[['ster', 'var(--geel)', 88, 18, 44], ['hart', 'var(--roze)', 76, 62, 30, 12], ['ring', 'rgba(255,255,255,.55)', 94, 70, 36], ['at', '#fff', 64, 20, 26, -10], ['ster', '#fff', 70, 84, 18]]} />
      {sticker && <span className="sticker" style={{ '--draai': '-3deg' }}>{sticker}</span>}
      <h1>{titel}</h1>
      {lead && <p>{lead}</p>}
    </section>
  );
}

export function Slotblok() {
  return (
    <section className="slotblok">
      <Decor items={[['ster', 'var(--roze)', 8, 20, 40], ['hart', 'var(--roze)', 90, 24, 34, 12], ['ster', 'var(--kobalt)', 84, 70, 24], ['at', 'var(--kobalt)', 12, 72, 30, -8]]} />
      <h2>Klaar om <span className="storytekst">gepost</span> te worden?</h2>
      <p>Ontwerp je spiegel in twee minuten. Je krijgt eerst een digitale proef, en we maken hem pas na jouw akkoord.</p>
      <Link className="knop knop--roze knop--groot" href="/ontwerpen">Ontwerp de jouwe</Link>
    </section>
  );
}
