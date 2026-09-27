'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { klantenNodig, Muur, useOntwerp } from '@/components/Ontwerp';
import { Beeldmerk } from '@/components/Merk';
import { euro, KADERS, kaderNaam, LED, prijsVan, VANAF, VORMEN, formaatVan } from '@/lib/spiegel';
import { MAKEN, VOORBEELDEN, VRAGEN } from '@/lib/inhoud';

const JAREN = 3;
const PER_KLANT = 45;

/* ---------------------------------------------------------------- stories */
function maakStories(cfg) {
  const prijs = prijsVan(cfg);
  const nodig = klantenNodig(prijs, PER_KLANT);
  const perDag = (prijs / (JAREN * 365)).toFixed(2).replace('.', ',');
  return {
    verhaal: {
      titel: 'Verhaal',
      slides: [
        { kleur: 'lila', kop: 'Wij maken al jaren reclame voor ondernemers.' },
        { kleur: 'boter', kop: 'Borden, gevels en auto’s.', tekst: 'Ze hangen en rijden, en worden gezien.' },
        { kleur: 'blush', kop: 'Maar de beste reclame maakt je klant zelf.' },
        { kleur: 'mint', kop: 'Dus maakten we een spiegel die gepost wil worden.', cta: true },
      ],
    },
    maken: {
      titel: 'Zo maken we hem',
      slides: MAKEN.map(([kop, tekst], i) => ({ kleur: ['hemel', 'lila', 'mint', 'perzik'][i % 4], kop, tekst })).concat([{ kleur: 'blush', kop: 'In onze eigen werkplaats bij Sign Company.', cta: true }]),
    },
    terug: {
      titel: 'Terugverdienen',
      slides: [
        { kleur: 'perzik', kop: `Stel: een nieuwe klant levert je ${euro(PER_KLANT)} op.` },
        { kleur: 'boter', kop: `Dan is je spiegel van ${euro(prijs)} terug na ${nodig} nieuwe klanten.` },
        { kleur: 'mint', kop: `Hangt hij ${JAREN} jaar? Dan kost hij € ${perDag} per dag.`, tekst: 'Reken het met je eigen getallen uit op Ons verhaal.', cta: true },
      ],
    },
    vragen: {
      titel: 'Vragen',
      slides: VRAGEN.slice(0, 6).map(([kop, tekst], i) => ({ kleur: ['boter', 'lila', 'mint', 'blush', 'hemel', 'perzik'][i], kop, tekst }))
        .concat([{ kleur: 'lila', kop: 'Meer vragen?', tekst: 'Alles staat op de pagina Vragen.', link: ['/vragen', 'Naar alle vragen'] }]),
    },
  };
}

const DUUR = 5000;

function StoryKijker({ story, onSluit }) {
  const [nu, setNu] = useState(0);
  const [stil, setStil] = useState(false);
  const laatste = nu === story.slides.length - 1;
  const s = story.slides[nu];

  useEffect(() => { setStil(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => {
    if (stil || laatste) return;
    const t = setTimeout(() => setNu((n) => n + 1), DUUR);
    return () => clearTimeout(t);
  }, [nu, stil, laatste]);
  useEffect(() => {
    const toets = (e) => {
      if (e.key === 'Escape') onSluit();
      if (e.key === 'ArrowRight') setNu((n) => Math.min(story.slides.length - 1, n + 1));
      if (e.key === 'ArrowLeft') setNu((n) => Math.max(0, n - 1));
    };
    window.addEventListener('keydown', toets);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', toets); document.body.style.overflow = ''; };
  }, [onSluit, story.slides.length]);

  const tik = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left < r.width / 3) setNu((n) => Math.max(0, n - 1));
    else if (laatste) onSluit();
    else setNu((n) => n + 1);
  };

  return (
    <div className="kijker" role="dialog" aria-modal="true" aria-label={story.titel} onClick={onSluit}>
      <div className={`kijker__story story-${s.kleur}`} onClick={(e) => e.stopPropagation()}>
        <div className="kijker__balk">
          {story.slides.map((_, i) => (
            <i key={i} className={i < nu ? 'is-vol' : ''}>
              {i === nu && <b key={nu} className={!stil && !laatste ? 'is-bezig' : 'is-vol'} style={{ '--duur': `${DUUR}ms` }} />}
            </i>
          ))}
        </div>
        <div className="kijker__kop">
          <span className="kijker__avatar"><Beeldmerk /></span>
          <b>socialmediaspiegel</b><span>{story.titel}</span>
          <button type="button" className="kijker__sluit" onClick={onSluit} aria-label="Sluit story">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="kijker__vlak" onClick={tik}>
          <p key={`k${nu}`} className="kijker__tekst">{s.kop}</p>
          {s.tekst && <p key={`t${nu}`} className="kijker__klein">{s.tekst}</p>}
        </div>
        {(s.cta || s.link) && (
          <div className="kijker__actie">
            {s.link
              ? <Link className="knop knop--framboos" href={s.link[0]}>{s.link[1]}</Link>
              : <Link className="knop knop--framboos" href="/ontwerpen">Ontwerp de jouwe</Link>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- posts */
function maakPosts(cfg) {
  const nodig = klantenNodig(prijsVan(cfg), PER_KLANT);
  const v = VOORBEELDEN;
  const impressie = 'Impressiebeeld. Echte foto’s volgen zodra de eerste spiegels hangen.';
  return [
    { soort: 'beeld', groot: true, src: '/beeld/selfie.jpg', alt: 'Vrouw maakt een selfie voor een spiegel in telefoonvorm in een roze salon', kop: 'Word gepost.', tekst: 'Zo werkt het: je klant ziet zichzelf in een spiegel die op een post lijkt, pakt haar telefoon en deelt het. Met jouw naam erbij.', noot: impressie, actie: ['link', '/ontwerpen', 'Ontwerp de jouwe'] },
    { soort: 'tekst', kleur: 'blush', kop: 'Elke selfie is reclame.', tekst: 'Wie voor jouw spiegel een selfie maakt, zet jouw naam in zijn story. Zonder dat je erom vraagt.', actie: ['link', '/ontwerpen', 'Ontwerp de jouwe'] },
    { soort: 'tekst', kleur: 'mint', kop: 'Echt glas.', tekst: 'Spiegelglas van 4 mm met veiligheidsfolie. Scherp, krasvast en makkelijk schoon.', actie: ['story', 'maken', 'Zo maken we hem'] },
    { soort: 'beeld', src: '/beeld/barber.jpg', alt: 'Man maakt een selfie voor een zwarte spiegel in postvorm in een barbershop', kop: 'Barber', tekst: 'Postvorm met zwart kader en warm licht. Past bij hout, leer en groen.', noot: impressie, actie: ['link', '/ontwerpen', 'Maak zo’n spiegel'] },
    { soort: 'tekst', kleur: 'perzik', kop: `Terug na ${nodig} klanten.`, tekst: `Levert een nieuwe klant je ${euro(PER_KLANT)} op? Dan heb je hem na ${nodig} nieuwe klanten terugverdiend.`, actie: ['story', 'terug', 'Reken mee'] },
    { soort: 'beeld', src: '/beeld/wimpers.jpg', alt: 'Vrouw bekijkt haar wimpers in een lila spiegel in telefoonvorm met koel licht', kop: 'Wimperstudio', tekst: 'Telefoonvorm met lila kader en koel wit licht. Je klant ziet het resultaat meteen, en deelt het.', noot: impressie, actie: ['link', '/ontwerpen', 'Maak zo’n spiegel'] },
    { soort: 'foto', v: v[0] },
    { soort: 'kleuren', kleur: 'lila', kop: 'Jouw huiskleur.', tekst: 'Het kader is bedrukte folie, dus elke kleur kan. Kies uit onze kleuren of geef je eigen kleur op.', actie: ['link', '/ontwerpen', 'Kies je kleur'] },
    { soort: 'beeld', src: '/beeld/detail.jpg', alt: 'Detail van de spiegelrand: glas vlak in het witte kader met LED-gloed op de muur', kop: 'Vlak glas, zachte gloed', tekst: 'Het glas ligt precies gelijk met het kader. Kies je licht, dan valt er een zachte gloed rondom op je muur.', noot: impressie, actie: ['story', 'maken', 'Zo maken we hem'] },
    { soort: 'beeld', src: '/beeld/cafe.jpg', alt: 'Twee vriendinnen maken een selfie voor een gele spiegel in postvorm in een koffiebar', kop: 'Koffiebar', tekst: 'Postvorm met boterkleurig kader. Gasten maken er vanzelf een foto, en jouw zaak reist mee.', noot: impressie, actie: ['link', '/ontwerpen', 'Maak zo’n spiegel'] },
    { soort: 'foto', v: v[1] },
    { soort: 'foto', v: v[2] },
  ];
}

function Tegel({ post }) {
  if (post.soort === 'beeld') {
    return (
      <>
        <img className="tegel__beeld" src={post.src} alt="" loading={post.groot ? 'eager' : 'lazy'} />
        {post.groot && (
          <span className="tegel__vast" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M9 3h6l-1 6 4 3v2h-5v7l-1 1-1-1v-7H6v-2l4-3z" fill="currentColor" /></svg>
          </span>
        )}
      </>
    );
  }
  if (post.soort === 'foto') {
    return (
      <>
        <Muur foto={post.v.foto} kleur={post.v.kleur} cfg={post.v.cfg} className="tegel__muur" />
        <span className="tegel__label">{post.v.tag}</span>
      </>
    );
  }
  return (
    <span className={`tegel__tekst story-${post.kleur}`}>
      <b>{post.kop}</b>
      {post.soort === 'kleuren' && (
        <span className="tegel__stalen">{Object.values(KADERS).map((k) => <i key={k.kleur} style={{ background: k.kleur }} />)}</span>
      )}
    </span>
  );
}

function PostVenster({ post, onSluit, onStory }) {
  const { setCfg } = useOntwerp();
  const router = useRouter();

  useEffect(() => {
    const toets = (e) => { if (e.key === 'Escape') onSluit(); };
    window.addEventListener('keydown', toets);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', toets); document.body.style.overflow = ''; };
  }, [onSluit]);

  const gebruik = () => { setCfg((c) => ({ ...c, ...post.v.cfg })); router.push('/ontwerpen'); };
  const foto = post.soort === 'foto';
  const beeld = post.soort === 'beeld';

  return (
    <div className="venster" role="dialog" aria-modal="true" onClick={onSluit}>
      <article className="venster__post" onClick={(e) => e.stopPropagation()}>
        <div className="venster__beeld">
          {foto && <Muur foto={post.v.foto} kleur={post.v.kleur} cfg={post.v.cfg} interactief />}
          {beeld && <img className="venster__foto" src={post.src} alt={post.alt} />}
          {!foto && !beeld && <span className={`venster__vlak story-${post.kleur}`}><b>{post.kop}</b></span>}
        </div>
        <div className="venster__zij">
          <header className="venster__kop">
            <span className="venster__avatar"><Beeldmerk /></span>
            <b>socialmediaspiegel</b>
            <button type="button" className="venster__sluit" onClick={onSluit} aria-label="Sluit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>
          </header>
          {foto ? (
            <div className="venster__tekst">
              <p><b>socialmediaspiegel</b> Zo zou hij hangen bij een {post.v.tag.toLowerCase()}. Dubbeltik op het glas.</p>
              <dl>
                <div><dt>Vorm</dt><dd>{VORMEN[post.v.cfg.vorm].label}, {formaatVan(post.v.cfg).maat}</dd></div>
                <div><dt>Kader</dt><dd>{kaderNaam(post.v.cfg)}</dd></div>
                <div><dt>Licht</dt><dd>{LED[post.v.cfg.led].label}</dd></div>
                <div><dt>Prijs</dt><dd>{euro(prijsVan(post.v.cfg))}</dd></div>
              </dl>
              <p className="venster__klein">Voorbeeldontwerp. Naam en logo worden de jouwe.</p>
            </div>
          ) : (
            <div className="venster__tekst">
              <p><b>socialmediaspiegel</b> {post.tekst}</p>
              {post.noot && <p className="venster__klein">{post.noot}</p>}
            </div>
          )}
          <footer className="venster__voet">
            {foto && <button type="button" className="knop knop--framboos" onClick={gebruik}>Gebruik dit ontwerp</button>}
            {!foto && post.actie[0] === 'link' && <Link className="knop knop--framboos" href={post.actie[1]}>{post.actie[2]}</Link>}
            {!foto && post.actie[0] === 'story' && <button type="button" className="knop knop--framboos" onClick={() => onStory(post.actie[1])}>{post.actie[2]}</button>}
          </footer>
        </div>
      </article>
    </div>
  );
}

/* ---------------------------------------------------------------- profiel */
const HIGHLIGHTS = [
  { id: 'ontwerp', label: 'Ontwerp', kleur: 'framboos', link: '/ontwerpen', icoon: 'M12 5v14M5 12h14' },
  { id: 'verhaal', label: 'Verhaal', kleur: 'lila', icoon: 'M5 4h10l4 4v12H5z M9 12h6M9 16h4' },
  { id: 'maken', label: 'Zo maken', kleur: 'mint', icoon: 'M4 20l6-6M14 4l6 6-8 8-6-6z' },
  { id: 'terug', label: 'Terug', kleur: 'perzik', icoon: 'M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4 M12 8v4l3 2' },
  { id: 'vragen', label: 'Vragen', kleur: 'boter', icoon: 'M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5' },
  { id: 'voorbeelden', label: 'Voorbeelden', kleur: 'hemel', link: '/voorbeelden', icoon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
];

export default function Profiel() {
  const { cfg } = useOntwerp();
  const [story, setStory] = useState(null);
  const [post, setPost] = useState(null);
  const stories = maakStories(cfg);
  const posts = maakPosts(cfg);
  const sluitStory = useCallback(() => setStory(null), []);
  const sluitPost = useCallback(() => setPost(null), []);
  const kleuren = Object.keys(KADERS).length;

  return (
    <>
      <section className="profiel">
        <button type="button" className="profiel__avatar" onClick={() => setStory('verhaal')} aria-label="Bekijk ons verhaal">
          <span className="profiel__ring"><Beeldmerk /></span>
        </button>
        <div className="profiel__info">
          <div className="profiel__naamrij">
            <h1>socialmediaspiegel</h1>
            <div className="profiel__knoppen">
              <Link className="knop knop--framboos" href="/ontwerpen">Ontwerp de jouwe</Link>
              <Link className="knop knop--zacht" href="/vragen">Vragen</Link>
            </div>
          </div>
          <ul className="profiel__stats">
            <li><b>2</b> vormen</li>
            <li><b>{kleuren}</b> kleuren + je eigen</li>
            <li>vanaf <b>{euro(VANAF)}</b></li>
          </ul>
          <div className="profiel__bio">
            <p className="profiel__titel">Spiegels die gepost willen worden</p>
            <p>Jouw naam en logo op een echte spiegel in de vorm van een social post. Voor salons, barbers en horeca. Gemaakt in onze werkplaats bij Sign Company.</p>
            <Link className="profiel__link" href="/ontwerpen">socialmediaspiegel.nl/ontwerpen</Link>
          </div>
        </div>
      </section>

      <section className="highlights" aria-label="Uitgelicht">
        {HIGHLIGHTS.map((h) => {
          const inhoud = (
            <>
              <span className={`highlight__cirkel story-${h.kleur}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={h.icoon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="highlight__label">{h.label}</span>
            </>
          );
          return h.link
            ? <Link key={h.id} className="highlight" href={h.link}>{inhoud}</Link>
            : <button key={h.id} type="button" className="highlight" onClick={() => setStory(h.id)}>{inhoud}</button>;
        })}
      </section>

      <section className="feed" aria-label="Posts">
        <div className="feed__tab">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          Posts
        </div>
        <div className="feed__grid">
          {posts.map((p, i) => (
            <button key={i} type="button" className={`tegel${p.groot ? ' tegel--groot' : ''}`} onClick={() => setPost(p)} aria-label={p.soort === 'foto' ? `Voorbeeld ${p.v.tag}` : p.alt || p.kop}>
              <Tegel post={p} />
            </button>
          ))}
        </div>
        <Link className="feed__meer knop knop--zacht" href="/voorbeelden">Bekijk alle voorbeelden</Link>
      </section>

      {post && <PostVenster post={post} onSluit={sluitPost} onStory={(id) => { setPost(null); setStory(id); }} />}
      {story && <StoryKijker story={stories[story]} onSluit={sluitStory} />}
    </>
  );
}
