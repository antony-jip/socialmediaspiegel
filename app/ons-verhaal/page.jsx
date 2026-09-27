import { Verhaal } from '@/components/Ontwerp';
import { Paginakop, Slotblok } from '@/components/Blokken';
import { Decor } from '@/components/Merk';
import { MAKEN } from '@/lib/inhoud';

export const metadata = { title: 'Ons verhaal', description: 'Socialmediaspiegel komt uit de werkplaats van Sign Company. Reclame die je klant zelf maakt.' };

export default function OnsVerhaal() {
  return (
    <>
      <Paginakop sticker="Ons verhaal" titel="Reclame die zichzelf deelt." lead="Een bord hangt stil. Een spiegel wordt gedeeld." />
      <Verhaal />
      <section className="maken">
        <Decor items={[['ster', 'var(--roze)', 92, 8, 36], ['hart', 'var(--geel)', 4, 90, 28, -12]]} />
        <h2>Zo maken we <span className="storytekst">hem.</span></h2>
        <div className="maken__rij">
          {MAKEN.map(([kop, tekst]) => (
            <article key={kop}><h3>{kop}</h3><p>{tekst}</p></article>
          ))}
        </div>
      </section>
      <Slotblok />
    </>
  );
}
