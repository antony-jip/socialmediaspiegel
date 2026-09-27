import { Bestellen, Hero, MobielBalk, Ontwerper, OntwerpProvider, Reclame, Voorbeelden } from '@/components/Ontwerp';

const VOORBEELDEN = [
  { foto: '/foto/kapper.jpg', kleur: 'var(--geel)', tag: 'Kapper', cfg: { naam: 'knipstudio.zwolle', ondertitel: 'Hair · Color · Care', likes: 4820, reacties: 132, vorm: 'post', formaat: 'm', led: 'warm', kader: 'zwart' } },
  { foto: '/foto/nagels.jpg', kleur: 'var(--roze)', tag: 'Nagelstudio', cfg: { naam: 'nailsbyfleur', ondertitel: 'Gel · Biab · Art', likes: 23400, reacties: 861, vorm: 'telefoon', formaat: 'm', led: 'koel', kader: 'wit' } },
  { foto: '/foto/horeca.jpg', kleur: 'var(--groen)', tag: 'Horeca', cfg: { naam: 'koffiebar.dewerf', ondertitel: 'Koffie · Brunch · Borrel', likes: 1290, reacties: 48, vorm: 'post', formaat: 'm', led: 'rgb', kader: 'geel' } },
];

const STAPPEN = [
  ['Ontwerp hem hier', 'Naam, logo, kleur en licht. Je ziet meteen hoe hij wordt.'],
  ['Keur je proef', 'Binnen één werkdag een digitale proef. Pas na jouw akkoord maken we hem, en betaal je.'],
  ['Hang hem op', 'Binnen tien werkdagen bij je bezorgd, met boormal en ophangset.'],
];

const VRAGEN = [
  ['Staat er een app-logo op?', 'Nee. Hij lijkt op een post, maar zonder logo’s van apps. Alleen jouw naam en jouw logo.'],
  ['Moet hij verlicht zijn?', 'Nee, standaard is hij onverlicht. Kies je licht, dan krijg je warm wit, koel wit of RGB. Bij RGB kies je zelf de kleur met een afstandsbediening.'],
  ['Kan het kader in mijn huiskleur?', 'Ja. Het kader is bedrukte folie, dus elke kleur kan. Kies hem hierboven bij Eigen kleur.'],
  ['Kan het ook op maat?', 'Ja. Zet je maat in de opmerking bij je bestelling, dan krijg je een prijs bij je proef.'],
  ['Hoe hang ik hem op?', 'Je krijgt een boormal: tape hem waterpas op de muur, boor twee gaten en hang hem op. Met licht heb je alleen een stopcontact nodig.'],
  ['Waar wordt hij gemaakt?', 'In onze eigen werkplaats bij Sign Company. Glas, folie en licht onder één dak.'],
];

const WIE = ['Kappers', 'Nagelstudio’s', 'Barbers', 'Wimpers & brows', 'Tattooshops', 'Horeca', 'Sportscholen', 'Winkels'];

export default function Home() {
  return (
    <OntwerpProvider>
      <header className="balk">
        <a className="woordmerk" href="/">socialmedia<b>spiegel</b></a>
        <a className="knop knop--klein knop--wit" href="#ontwerp">Ontwerp de jouwe</a>
      </header>

      <main>
        <Hero />

        <div className="band" aria-label="Voor wie">
          <div className="band__rol">
            {[0, 1].map((k) => (
              <span key={k} aria-hidden={k === 1}>
                {WIE.map((w) => <span key={w}>{w}<i>·</i></span>)}
              </span>
            ))}
          </div>
        </div>

        <Reclame />
        <Ontwerper />
        <Voorbeelden items={VOORBEELDEN} />

        <section className="stappen">
          <h2>Van ontwerp tot aan je muur.</h2>
          <ol>
            {STAPPEN.map(([kop, tekst]) => (
              <li key={kop}><h3>{kop}</h3><p>{tekst}</p></li>
            ))}
          </ol>
        </section>

        <Bestellen />

        <section className="vragen">
          <h2>Goed om te weten.</h2>
          {VRAGEN.map(([v, a]) => (
            <details key={v}><summary>{v}</summary><p>{a}</p></details>
          ))}
        </section>
      </main>

      <footer className="voet">
        <span className="woordmerk">socialmedia<b>spiegel</b></span>
        <span>Een product van <a href="https://signcompany.nl">Sign Company</a></span>
      </footer>
      <MobielBalk />
    </OntwerpProvider>
  );
}
