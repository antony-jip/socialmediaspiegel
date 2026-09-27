// Twee manieren: afstandhouders (standaard, 4 cm van de muur, nodig voor Glow) of de lijmset (plat op de muur).
const AFSTAND = [
  ['Kies je plek', 'Wij adviseren de bovenkant op zo’n 1,85 m van de vloer, dan past bijna iedereen er helemaal in. Met Glow heb je een stopcontact in de buurt nodig.'],
  ['Leg de montagemal op de muur', 'De montagemal op ware grootte zit in de doos. Tape hem waterpas op de muur, precies waar de spiegel moet komen.'],
  ['Schroef de dopjes in de muur', 'Boor door de vier kruisjes, zet de pluggen erin en schroef de vier dopjes vast. Haal daarna de mal weg. In gipsplaat gebruik je hollewandpluggen.'],
  ['Klik hem erop', 'Houd de spiegel recht voor de dopjes en druk hem aan: klik. Hij zit vast, 4 cm van de muur, en je ziet niets van de bevestiging.'],
];
const KOKER = [
  ['Kies je plek', 'Wij adviseren de bovenkant op zo’n 1,85 m van de vloer. Met Glow heb je een stopcontact in de buurt nodig.'],
  ['Tape de boormal op de muur', 'De boormal zit in de doos. Tape hem waterpas op de muur, met de middenlijn op het midden van de spiegel.'],
  ['Boor twee gaten', 'Boor door de twee kruisjes, pluggen erin en draai de schroeven erin. Laat de koppen zo’n 5 mm uitsteken.'],
  ['Hang hem op', 'Zet de twee sleutelgaten in de koker over de schroeven en laat de spiegel zakken. Verhangen is net zo makkelijk.'],
];
const LIJM = [
  ['Maak de muur schoon', 'Stofvrij, droog en vetvrij. Op verse verf wacht je een week.'],
  ['Tape en kit op de achterkant', 'Plak de stroken dubbelzijdige tape over de achterkant en zet er verticale rupsen montagekit tussen. Niet de hele achterkant vol.'],
  ['Druk hem tegen de muur', 'Waterpas erlangs, stevig aandrukken. De tape houdt hem direct vast terwijl de kit uithardt.'],
  ['Laat hem uitharden', 'Na 24 uur zit hij vast. Let op: daarna gaat hij er niet meer netjes af.'],
];

function Stappen({ titel, uitleg, stappen }) {
  return (
    <div className="ophangen__manier">
      <h3>{titel}</h3>
      <p>{uitleg}</p>
      <ol className="ophangen__stappen">
        {stappen.map(([kop, tekst]) => <li key={kop}><b>{kop}</b><span>{tekst}</span></li>)}
      </ol>
    </div>
  );
}

export default function Ophangen() {
  return (
    <section className="ophangen" id="ophangen">
      <div className="ophangen__kop">
        <span className="label">Ophangen</span>
        <h2>Zo hang je hem op</h2>
        <p>Je kiest bij het bestellen hoe je hem ophangt: erop klikken, aan een koker hangen, of vastlijmen.</p>
      </div>
      <div className="ophangen__raster">
        <Stappen titel="Met klikbevestiging" uitleg="Standaard inbegrepen. Montagemal, vier dopjes en klik. Onzichtbaar, muurvast, en 4 cm van de muur zodat Glow een gloed rondom geeft." stappen={AFSTAND} />
        <Stappen titel="Met koker" uitleg="Inbegrepen. Een aluminium koker achter de spiegel, 4 cm van de muur. Je hangt hem aan twee schroeven, dus je kunt hem makkelijk verhangen." stappen={KOKER} />
        <Stappen titel="Met de lijmset" uitleg="Voor + € 15. Geen boren, plat tegen de muur. Glow kan dan niet, want daar is geen ruimte voor." stappen={LIJM} />
      </div>
    </section>
  );
}
