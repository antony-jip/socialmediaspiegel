import { Terugverdienen, Verhaal } from '@/components/Ontwerp';
import { Paginakop, Slotblok } from '@/components/Blokken';
import Doorsnede from '@/components/Doorsnede';
import { MAKEN } from '@/lib/inhoud';

export const metadata = { title: 'Ons verhaal', description: 'Socialmediaspiegel komt uit de werkplaats van Sign Company. Reclame die je klant zelf maakt.' };

export default function OnsVerhaal() {
  return (
    <>
      <Paginakop label="Ons verhaal" titel="Reclame die zichzelf deelt" lead="Een bord hangt stil. Een spiegel wordt gedeeld. Daarom maken we spiegels waar je klanten vanzelf een foto van willen." kleur="blush" beeld="/beeld/cafe.jpg" alt="Twee vriendinnen maken een selfie voor De Story in een koffiebar" />
      <Verhaal />
      <section className="maken">
        <div className="maken__kop">
          <span className="label">Vakwerk</span>
          <h2>Zo maken we hem</h2>
          <p>Elke spiegel bouwen we in onze eigen werkplaats bij Sign Company, van tekening tot ophangset.</p>
        </div>
        <div className="maken__raster">
          <img className="maken__foto" src="/beeld/detail.jpg" alt="Detail van de rand: glas vlak in het kader, met zachte gloed op de muur" loading="lazy" />
          <dl className="maken__lijst">
            {MAKEN.map(([kop, tekst]) => (
              <div key={kop}><dt>{kop}</dt><dd>{tekst}</dd></div>
            ))}
          </dl>
        </div>
        <div className="maken__doorsnede">
          <div>
            <h3>Van opzij bekeken</h3>
            <p>Glas en kader liggen precies vlak. Hij hangt aan een rail, 4 cm van je muur: in drie stappen opgehangen, onzichtbaar, en met ruimte voor een zachte gloed rondom.</p>
          </div>
          <Doorsnede />
        </div>
      </section>
      <Terugverdienen />
      <Slotblok />
    </>
  );
}
