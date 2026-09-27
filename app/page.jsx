import { Aanvraag, Muur, Ontwerper, OntwerpProvider } from '@/components/Ontwerp';

const VOORBEELDEN = [
  { foto: '/foto/kapper.jpg', kleur: 'var(--geel)', tag: 'Kapper', cfg: { naam: 'knipstudio.zwolle', ondertitel: 'Hair · Color · Care', likes: 4820, reacties: 132, vorm: 'post', formaat: 'm', led: 'warm', kader: 'donker' } },
  { foto: '/foto/nagels.jpg', kleur: 'var(--roze)', tag: 'Nagelstudio', cfg: { naam: 'nailsbyfleur', ondertitel: 'Gel · Biab · Art', likes: 23400, reacties: 861, vorm: 'telefoon', formaat: 'm', led: 'koel', kader: 'licht' } },
  { foto: '/foto/horeca.jpg', kleur: 'var(--groen)', tag: 'Horeca', cfg: { naam: 'koffiebar.dewerf', ondertitel: 'Koffie · Brunch · Borrel', likes: 1290, reacties: 48, vorm: 'post', formaat: 'm', led: 'uit', kader: 'licht' } },
];

const STAPPEN = [
  ['Ontwerp hem hier', 'Naam, logo, formaat en licht. Je ziet meteen hoe hij wordt.'],
  ['Keur je proef', 'Je krijgt binnen één werkdag een digitale proef. We maken hem pas na jouw akkoord.'],
  ['Hang hem op', 'Binnen tien werkdagen bij je bezorgd, met ophangset en stekker.'],
];

const VRAGEN = [
  ['Staat er een app-logo op?', 'Nee. Hij lijkt op een post, maar zonder logo’s van apps. Alleen jouw naam en jouw logo.'],
  ['Kan het ook op maat?', 'Ja. Zet je maat in de opmerking bij je aanvraag, dan krijg je een prijs bij je proef.'],
  ['Hoe hang ik hem op?', 'Hij komt met een ophangset. Met licht zit er een stekker aan, dus je hebt alleen een stopcontact nodig.'],
  ['Waar wordt hij gemaakt?', 'In onze eigen werkplaats bij Sign Company. Glas, print en licht onder één dak.'],
];

const WIE = ['Kappers', 'Nagelstudio’s', 'Barbers', 'Wimpers & brows', 'Tattooshops', 'Horeca', 'Sportscholen', 'Winkels'];

export default function Home() {
  return (
    <OntwerpProvider>
      <header className="balk">
        <a className="woordmerk" href="/">socialmedia<b>spiegel</b></a>
        <a className="knop knop--klein knop--wit" href="#aanvraag">Vraag aan</a>
      </header>

      <main>
        <Ontwerper />

        <div className="band" aria-label="Voor wie">
          <div className="band__rol">
            {[0, 1].map((k) => (
              <span key={k} aria-hidden={k === 1}>
                {WIE.map((w) => <span key={w}>{w}<i>·</i></span>)}
              </span>
            ))}
          </div>
        </div>

        <section className="voorbeelden">
          <h2>Zo hangt hij bij anderen.</h2>
          <div className="voorbeelden__rij">
            {VOORBEELDEN.map((v) => (
              <figure key={v.tag}>
                <Muur foto={v.foto} kleur={v.kleur} cfg={v.cfg} />
                <figcaption>{v.tag}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="stappen">
          <h2>Van ontwerp tot aan je muur.</h2>
          <ol>
            {STAPPEN.map(([kop, tekst]) => (
              <li key={kop}><h3>{kop}</h3><p>{tekst}</p></li>
            ))}
          </ol>
        </section>

        <Aanvraag />

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
    </OntwerpProvider>
  );
}
