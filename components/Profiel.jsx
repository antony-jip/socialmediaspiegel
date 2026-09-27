'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { klantenNodig, Muur, useGebruikOntwerp, useOntwerp } from '@/components/Ontwerp';
import { Beeldmerk } from '@/components/Merk';
import Zin from '@/components/Zin';
import { euro, formaatVan, KADERS, kaderNaam, LED, prijsVan, VANAF, VORMEN } from '@/lib/spiegel';
import { MAKEN, VOORBEELDEN, VRAGEN } from '@/lib/inhoud';

const JAREN = 3;
const PER_KLANT = 45;
const IMPRESSIE = 'Impressiebeelden. Echte foto’s volgen zodra de eerste spiegels hangen.';
const vb = Object.fromEntries(VOORBEELDEN.map((v) => [v.id, v]));

function useStil() {
  const [stil, setStil] = useState(false);
  useEffect(() => { setStil(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  return stil;
}

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
      slides: MAKEN.map(([kop, tekst], i) => ({ kleur: ['hemel', 'lila', 'mint', 'perzik'][i % 4], kop, tekst }))
        .concat([{ kleur: 'blush', kop: 'In onze eigen werkplaats bij Sign Company.', cta: true }]),
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
  const stil = useStil();
  const laatste = nu === story.slides.length - 1;
  const s = story.slides[nu];

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
          <p key={`k${nu}`} className="kijker__tekst"><Zin>{s.kop}</Zin></p>
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
  return [
    { soort: 'voorbeeld', v: vb.salon, groot: true, reel: '/beeld/reel-selfie.mp4', tekst: 'Zo werkt het: je klant ziet zichzelf in een spiegel die op een post lijkt, pakt haar telefoon en deelt het. Met jouw naam erbij.' },
    { soort: 'tekst', kleur: 'blush', kop: 'Elke selfie is reclame.', tekst: 'Wie voor jouw spiegel een selfie maakt, zet jouw naam in zijn story. Zonder dat je erom vraagt.', actie: ['link', '/ontwerpen', 'Ontwerp de jouwe'] },
    { soort: 'tekst', kleur: 'mint', kop: 'Echt glas.', tekst: 'Spiegelglas van 4 mm met veiligheidsfolie. Scherp, krasvast en makkelijk schoon.', actie: ['story', 'maken', 'Zo maken we hem'] },
    { soort: 'voorbeeld', v: vb.nagels, tekst: 'Je klant ziet het resultaat meteen, en deelt het meteen.' },
    { soort: 'tekst', kleur: 'perzik', kop: `Terug na ${nodig} klanten.`, tekst: `Levert een nieuwe klant je ${euro(PER_KLANT)} op? Dan heb je hem na ${nodig} nieuwe klanten terugverdiend.`, actie: ['story', 'terug', 'Reken mee'] },
    { soort: 'voorbeeld', v: vb.barber, tekst: 'De Post met zwart kader en warme gloed. Past bij hout, leer en groen.' },
    { soort: 'jouw' },
    { soort: 'kleuren', kleur: 'lila', kop: 'Jouw huiskleur.', tekst: 'Het kader is bedrukte folie, dus elke kleur kan. Kies uit onze kleuren of geef je eigen kleur op.', actie: ['link', '/ontwerpen', 'Kies je kleur'] },
    { soort: 'voorbeeld', v: vb.wimpers, tekst: 'De Story met lila kader en koele gloed, naast de behandelplek.' },
    { soort: 'voorbeeld', v: vb.cafe, tekst: 'De Post met boterkleurig kader. Gasten maken er vanzelf een foto, en jouw zaak reist mee.' },
    { soort: 'voorbeeld', v: vb.rgb, tekst: 'Glow RGB: ’s avonds kleurt de muur mee. Je kiest de kleur met een afstandsbediening.' },
    { soort: 'voorbeeld', v: vb.kapper, tekst: 'De Story in blush, groot formaat, met warme gloed.' },
  ];
}

function Tegel({ post, stil }) {
  const { cfg, logo } = useOntwerp();
  if (post.soort === 'voorbeeld') {
    return (
      <>
        {post.reel && !stil
          ? <video className="tegel__beeld" src={post.reel} poster={post.v.beeld} autoPlay muted loop playsInline preload="metadata" />
          : <img className="tegel__beeld" src={post.v.beeld} alt="" loading={post.groot ? 'eager' : 'lazy'} />}
        {post.groot && (
          <span className="tegel__vast" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M9 3h6l-1 6 4 3v2h-5v7l-1 1-1-1v-7H6v-2l4-3z" fill="currentColor" /></svg>
          </span>
        )}
        {!post.groot && <span className="tegel__label">{post.v.tag}</span>}
      </>
    );
  }
  if (post.soort === 'jouw') {
    return (
      <>
        <Muur foto="/foto/salon.jpg" kleur="var(--blush)" cfg={cfg} logo={logo} className="tegel__muur" />
        <span className="tegel__label tegel__label--jouw">Jouw ontwerp · @{cfg.naam || 'jouwnaam'}</span>
      </>
    );
  }
  return (
    <span className={`tegel__tekst story-${post.kleur}`}>
      <b><Zin>{post.kop}</Zin></b>
      {post.soort === 'kleuren' && (
        <span className="tegel__stalen">{Object.values(KADERS).map((k) => <i key={k.kleur} style={{ background: k.kleur }} />)}</span>
      )}
    </span>
  );
}

function PostVenster({ post, onSluit, onStory }) {
  const gebruik = useGebruikOntwerp();
  const stil = useStil();

  useEffect(() => {
    const toets = (e) => { if (e.key === 'Escape') onSluit(); };
    window.addEventListener('keydown', toets);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', toets); document.body.style.overflow = ''; };
  }, [onSluit]);

  const v = post.v;

  return (
    <div className="venster" role="dialog" aria-modal="true" onClick={onSluit}>
      <article className="venster__post" onClick={(e) => e.stopPropagation()}>
        <div className="venster__beeld">
          {v && (post.reel && !stil
            ? <video className="venster__foto" src={post.reel} poster={v.beeld} autoPlay muted loop playsInline />
            : <img className="venster__foto" src={v.beeld} alt={v.alt} />)}
          {!v && <span className={`venster__vlak story-${post.kleur}`}><b><Zin>{post.kop}</Zin></b></span>}
        </div>
        <div className="venster__zij">
          <header className="venster__kop">
            <span className="venster__avatar"><Beeldmerk /></span>
            <b>socialmediaspiegel</b>
            {v && <span className="venster__plek">{v.tag}</span>}
            <button type="button" className="venster__sluit" onClick={onSluit} aria-label="Sluit">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>
          </header>
          <div className="venster__tekst">
            <p><b>socialmediaspiegel</b> {post.tekst}</p>
            {v && (
              <dl>
                <div><dt>Model</dt><dd>{VORMEN[v.cfg.vorm].label}, {formaatVan(v.cfg).maat}</dd></div>
                <div><dt>Kader</dt><dd>{kaderNaam(v.cfg)}</dd></div>
                <div><dt>Licht</dt><dd>{LED[v.cfg.led].label}</dd></div>
                <div><dt>Prijs</dt><dd>{euro(prijsVan(v.cfg))}</dd></div>
              </dl>
            )}
            {v && <p className="venster__klein">{IMPRESSIE} Naam en logo worden de jouwe.</p>}
          </div>
          <footer className="venster__voet">
            {v && <button type="button" className="knop knop--framboos" onClick={() => gebruik(v.cfg)}>Gebruik dit ontwerp</button>}
            {!v && post.actie[0] === 'link' && <Link className="knop knop--framboos" href={post.actie[1]}>{post.actie[2]}</Link>}
            {!v && post.actie[0] === 'story' && <button type="button" className="knop knop--framboos" onClick={() => onStory(post.actie[1])}>{post.actie[2]}</button>}
          </footer>
        </div>
      </article>
    </div>
  );
}

/* ---------------------------------------------------------------- profiel */
const HIGHLIGHTS = [
  { id: 'ontwerp', label: 'Ontwerp', link: '/ontwerpen' },
  { id: 'verhaal', label: 'Verhaal', cover: '/beeld/selfie.jpg' },
  { id: 'maken', label: 'Zo maken', cover: '/beeld/detail.jpg' },
  { id: 'terug', label: 'Terug', cover: '/beeld/cafe.jpg' },
  { id: 'vragen', label: 'Vragen', cover: '/beeld/wimpers.jpg' },
  { id: 'voorbeelden', label: 'Voorbeelden', cover: '/beeld/nagels.jpg', link: '/voorbeelden' },
];

export default function Profiel() {
  const { cfg } = useOntwerp();
  const [story, setStory] = useState(null);
  const [post, setPost] = useState(null);
  const stil = useStil();
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
              <Link className="knop knop--zacht" href="/voorbeelden">Voorbeelden</Link>
            </div>
          </div>
          <ul className="profiel__stats">
            <li><b>Echt</b> spiegelglas</li>
            <li><b>2</b> modellen</li>
            <li><b>{kleuren}</b> kleuren + je eigen</li>
            <li>vanaf <b>{euro(VANAF)}</b></li>
          </ul>
          <div className="profiel__bio">
            <p className="profiel__titel">Spiegels die gepost willen worden</p>
            <p>De Story en De Post: echte spiegels van glas in de vorm van een social post, met jouw naam en logo. Geen spiegelfolie, maar 4 mm spiegelglas. Voor salons, barbers en horeca. Gemaakt in onze werkplaats bij Sign Company.</p>
            <Link className="profiel__link" href="/ontwerpen">socialmediaspiegel.nl/ontwerpen</Link>
          </div>
        </div>
      </section>

      <section className="highlights" aria-label="Uitgelicht">
        {HIGHLIGHTS.map((h) => {
          const inhoud = (
            <>
              <span className={`highlight__cirkel${h.cover ? '' : ' highlight__cirkel--plus'}`}>
                {h.cover
                  ? <img src={h.cover} alt="" loading="lazy" />
                  : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>}
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
            p.soort === 'jouw'
              ? <Link key={i} href="/ontwerpen" className="tegel" aria-label="Bewerk jouw ontwerp"><Tegel post={p} stil={stil} /></Link>
              : (
                <button key={i} type="button" className={`tegel${p.groot ? ' tegel--groot' : ''}`} onClick={() => setPost(p)}
                  aria-label={p.v ? `Voorbeeld ${p.v.tag}` : p.kop}>
                  <Tegel post={p} stil={stil} />
                </button>
              )
          ))}
        </div>
        <p className="feed__noot">{IMPRESSIE}</p>
      </section>

      {post && <PostVenster post={post} onSluit={sluitPost} onStory={(id) => { setPost(null); setStory(id); }} />}
      {story && <StoryKijker story={stories[story]} onSluit={sluitStory} />}
    </>
  );
}
