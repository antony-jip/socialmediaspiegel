import { Paginakop, Slotblok } from '@/components/Blokken';
import { VRAGEN } from '@/lib/inhoud';

export const metadata = { title: 'Vragen', description: 'Alles over de socialmediaspiegel: glas, licht, kleur, ophangen, betalen en levertijd.' };

export default function Vragen() {
  return (
    <>
      <Paginakop label="Vragen" titel="Goed om te weten" kleur="boter" />
      <section className="vragen" id="vragen">
        {VRAGEN.map(([v, a]) => (
          <details key={v}><summary>{v}</summary><p>{a}</p></details>
        ))}
      </section>
      <Slotblok />
    </>
  );
}
