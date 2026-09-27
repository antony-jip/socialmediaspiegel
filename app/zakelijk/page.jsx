import { Paginakop } from '@/components/Blokken';
import ZakelijkFormulier from '@/components/Zakelijk';

export const metadata = { title: 'Zakelijk', description: 'Meerdere spiegels voor je vestigingen, of een socialmediaspiegel huren voor je evenement.' };

export default function Zakelijk() {
  return (
    <>
      <Paginakop label="Zakelijk" titel="Meer spiegels of eentje huren" lead="Voor ketens met meerdere vestigingen, en voor bruiloften, openingen en feesten." kleur="hemel" beeld="/beeld/rgb.jpg" alt="Vrienden maken ’s avonds een selfie voor De Story met RGB-gloed" />
      <section className="zakelijk">
        <article>
          <span className="label">Kopen</span>
          <h2>Meerdere vestigingen</h2>
          <ul>
            <li>Eén ontwerp, doorgevoerd in al je zaken</li>
            <li>Prijs op maat vanaf vijf spiegels</li>
            <li>Eén aanspreekpunt en levering per vestiging</li>
            <li>Altijd eerst een digitale proef</li>
          </ul>
        </article>
        <article>
          <span className="label">Huren</span>
          <h2>Voor je evenement</h2>
          <ul>
            <li>Voor bruiloften, openingen, beurzen en feesten</li>
            <li>Met jouw naam of hashtag in het kader</li>
            <li>Met Glow-licht, ook ’s avonds een blikvanger</li>
            <li>Ophalen en terugbrengen in Enkhuizen</li>
          </ul>
        </article>
      </section>
      <section className="bestellen" id="aanvraag">
        <div className="bestellen__kop">
          <h2>Vraag een voorstel aan</h2>
          <p>Vertel kort wat je zoekt. Je hoort binnen één werkdag van ons, met een voorstel en prijs.</p>
        </div>
        <ZakelijkFormulier />
      </section>
    </>
  );
}
