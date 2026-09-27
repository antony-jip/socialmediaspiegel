import Link from 'next/link';
import { Paginakop, Slotblok } from '@/components/Blokken';
import { VRAGEN } from '@/lib/inhoud';

export const metadata = { title: 'Vragen', description: 'Alles over De Story: glas, licht, kleur, ophangen, betalen en levertijd.' };

export default function Vragen() {
  return (
    <>
      <Paginakop label="Vragen" titel="Goed om te weten" lead="Over glas, licht, kleur, ophangen en betalen." kleur="boter" />
      <section className="vragen-raster" id="vragen">
        <div className="vragen">
          {VRAGEN.map(([v, a]) => (
            <details key={v}><summary>{v}</summary><p>{a}</p></details>
          ))}
        </div>
        <aside className="vragen__kaart">
          <img src="/beeld/nagels.jpg" alt="Vrouw toont haar nagels voor De Story met koele gloed" loading="lazy" />
          <div>
            <h3>Staat je vraag er niet bij?</h3>
            <p>Begin gewoon met ontwerpen. Je krijgt altijd eerst een digitale proef, en we maken hem pas na jouw akkoord.</p>
            <Link className="knop knop--framboos" href="/ontwerpen">Ontwerp de jouwe</Link>
            <Link className="knop knop--zacht" href="/voorbeelden">Bekijk voorbeelden</Link>
          </div>
        </aside>
      </section>
      <Slotblok />
    </>
  );
}
