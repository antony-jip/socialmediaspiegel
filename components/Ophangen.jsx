// Ophangen in vier stappen, volgens de werktekening: boormal, twee schroeven 5 mm, sleutelgaten 300 mm h.o.h.
const STAPPEN = [
  ['Kies je plek', 'Wij adviseren de bovenkant op zo’n 1,85 m van de vloer, dan past bijna iedereen er helemaal in. Kies je Glow, zorg dan voor een stopcontact in de buurt.'],
  ['Tape de boormal op de muur', 'De boormal zit in de doos. Tape hem waterpas op de muur, met de middenlijn op het midden van waar de spiegel moet komen.'],
  ['Boor twee gaten', 'Boor door de twee kruisjes, 6 mm, zet er een plug in en draai de schroeven erin. Laat de koppen zo’n 5 mm uitsteken. In gipsplaat gebruik je hollewandpluggen.'],
  ['Hang hem op', 'Haal de boormal weg, zet de twee sleutelgaten op de achterkant over de schroeven en laat de spiegel zakken. Met Glow steek je daarna de stekker in het stopcontact.'],
];

export default function Ophangen() {
  return (
    <section className="ophangen" id="ophangen">
      <div className="ophangen__kop">
        <span className="label">Ophangen</span>
        <h2>Zo hang je hem op</h2>
        <p>Klaar in een kwartier, met een boor en een waterpas. De spiegel weegt zo’n 11 kg en hangt aan twee schroeven.</p>
      </div>
      <ol className="ophangen__stappen">
        {STAPPEN.map(([kop, tekst]) => <li key={kop}><h3>{kop}</h3><p>{tekst}</p></li>)}
      </ol>
    </section>
  );
}
