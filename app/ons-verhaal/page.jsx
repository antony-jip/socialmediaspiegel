import { Terugverdienen, Verhaal } from '@/components/Ontwerp';
import { Paginakop, Slotblok } from '@/components/Blokken';
import { MAKEN } from '@/lib/inhoud';

export const metadata = { title: 'Ons verhaal', description: 'Socialmediaspiegel komt uit de werkplaats van Sign Company. Reclame die je klant zelf maakt.' };

export default function OnsVerhaal() {
  return (
    <>
      <Paginakop label="Ons verhaal" titel="Reclame die zichzelf deelt" lead="Een bord hangt stil. Een spiegel wordt gedeeld." kleur="blush" />
      <Verhaal />
      <section className="maken">
        <h2>Zo maken we hem</h2>
        <div className="maken__rij">
          {MAKEN.map(([kop, tekst]) => (
            <article key={kop}><h3>{kop}</h3><p>{tekst}</p></article>
          ))}
        </div>
      </section>
      <Terugverdienen />
      <Slotblok />
    </>
  );
}
