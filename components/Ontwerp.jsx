'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Spiegel from '@/components/Spiegel';
import { euro, formaatVan, KADERS, kaderKleur, kaderNaam, LED, prijsVan, START, VANAF, VORMEN } from '@/lib/spiegel';

const OntwerpCtx = createContext(null);
export const useOntwerp = () => useContext(OntwerpCtx);

export function OntwerpProvider({ children }) {
  const [cfg, setCfg] = useState(START);
  const [logo, setLogo] = useState(null);
  const zet = (k, v) => setCfg((c) => ({ ...c, [k]: v }));
  return <OntwerpCtx.Provider value={{ cfg, setCfg, zet, logo, setLogo }}>{children}</OntwerpCtx.Provider>;
}

export function Muur({ foto, kleur, cfg, logo, video, interactief, className = '', children }) {
  return (
    <div
      className={`muur muur--${cfg.vorm} muur--${cfg.formaat} ${className}`}
      style={{ '--muur': kleur, backgroundImage: foto ? `url(${foto})` : undefined }}
    >
      <div className="muur__hanger">
        <Spiegel cfg={cfg} logo={logo} video={video} interactief={interactief} />
      </div>
      {children}
    </div>
  );
}

const Vinkje = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export function Zekerheid() {
  return (
    <ul className="zekerheid">
      <li><Vinkje />Eerst een digitale proef</li>
      <li><Vinkje />Je betaalt pas na akkoord</li>
      <li><Vinkje />Gratis verzending</li>
    </ul>
  );
}

/* ---------------------------------------------------------------- hero */
export function Hero() {
  const { cfg, logo } = useOntwerp();
  const show = { ...cfg, led: cfg.led === 'uit' ? 'rgb' : cfg.led };
  return (
    <section className="hero">
      <div className="hero__tekst">
        <p className="hero__voor">Voor salons, barbers en horeca</p>
        <h1>Een spiegel die gepost wil worden.</h1>
        <p className="hero__lead">Jouw naam en logo op een spiegel in de vorm van een social post. Elke selfie die ervoor gemaakt wordt, is reclame voor jou.</p>
        <div className="hero__acties">
          <a className="knop knop--roze knop--groot" href="#ontwerp">Ontwerp de jouwe</a>
          <span className="hero__prijs">vanaf <b>{euro(VANAF)}</b></span>
        </div>
        <Zekerheid />
      </div>
      <Muur foto="/foto/salon.jpg" kleur="var(--kobalt-diep)" cfg={show} logo={logo} className="hero__muur" interactief />
    </section>
  );
}

/* ---------------------------------------------------------------- reclame */
export function Reclame() {
  const { cfg, logo } = useOntwerp();
  return (
    <section className="reclame">
      <div className="reclame__tekst">
        <h2>Elke selfie is reclame.</h2>
        <p className="reclame__lead">Wie voor jouw spiegel staat, zet jouw naam in zijn story. Zonder dat je erom vraagt.</p>
        <dl className="reclame__punten">
          <div><dt>Je naam staat in de foto</dt><dd>Niet in een tag die je kunt wegklikken, maar in het beeld zelf.</dd></div>
          <div><dt>Klanten taggen je vanzelf</dt><dd>Je accountnaam staat erop, dus ze weten precies wie ze moeten taggen.</dd></div>
          <div><dt>Een plek die mensen opzoeken</dt><dd>Een fotoplek waar klanten voor terugkomen, en hun vrienden ook.</dd></div>
        </dl>
      </div>
      <div className="telefoon" aria-label="Voorbeeld van een story met jouw spiegel">
        <div className="telefoon__scherm">
          <Muur foto="/foto/nagels.jpg" kleur="var(--roze)" cfg={{ ...cfg, vorm: 'telefoon', formaat: 'm', led: cfg.led === 'uit' ? 'koel' : cfg.led }} logo={logo} className="telefoon__muur" />
          <div className="story__balk"><i className="is-vol" /><i /><i /></div>
          <div className="story__kop"><span className="story__avatar" />jouwklant <small>2 u</small></div>
          <span className="story__tag">@{cfg.naam || 'jouwnaam'}</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ontwerper */
function Keuze({ label, waarde, opties, onKies }) {
  return (
    <fieldset className="keuze">
      <legend>{label}</legend>
      <div className="keuze__rij">
        {Object.entries(opties).map(([id, tekst]) => (
          <label key={id} className={waarde === id ? 'is-aan' : ''}>
            <input type="radio" name={label} value={id} checked={waarde === id} onChange={() => onKies(id)} />
            {tekst}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Kaderkleur() {
  const { cfg, zet } = useOntwerp();
  return (
    <fieldset className="keuze">
      <legend>Kleur kader <span className="keuze__waarde">{kaderNaam(cfg)}</span></legend>
      <div className="stalen">
        {Object.entries(KADERS).map(([id, k]) => (
          <label key={id} className={`staal${cfg.kader === id ? ' is-aan' : ''}`} style={{ '--staal': k.kleur }} title={k.label}>
            <input type="radio" name="kader" checked={cfg.kader === id} onChange={() => zet('kader', id)} aria-label={k.label} />
          </label>
        ))}
        <label className={`staal staal--eigen${cfg.kader === 'eigen' ? ' is-aan' : ''}`} style={{ '--staal': cfg.kaderKleur }}>
          <input
            type="color"
            value={cfg.kaderKleur}
            onChange={(e) => { zet('kaderKleur', e.target.value); zet('kader', 'eigen'); }}
            onClick={() => zet('kader', 'eigen')}
            aria-label="Kies je eigen kleur"
          />
          <span>Eigen kleur</span>
        </label>
      </div>
    </fieldset>
  );
}

function Camera({ onStream }) {
  const [aan, setAan] = useState(false);
  const [fout, setFout] = useState('');
  const stroom = useRef(null);

  useEffect(() => () => stroom.current?.getTracks().forEach((t) => t.stop()), []);

  const wissel = async () => {
    setFout('');
    if (aan) {
      stroom.current?.getTracks().forEach((t) => t.stop());
      stroom.current = null;
      onStream(null);
      setAan(false);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      stroom.current = s;
      onStream(s);
      setAan(true);
    } catch {
      setFout('Je camera staat uit. Geef je browser toegang om jezelf te zien.');
    }
  };

  return (
    <div className="camera">
      <button type="button" className="knop knop--wit knop--klein" onClick={wissel}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5h4l1.5-2.5h7L17 7.5h4v12H3z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        {aan ? 'Zet camera uit' : 'Kijk erin'}
      </button>
      <span className="camera__uitleg">{fout || 'Je beeld blijft op je eigen apparaat.'}</span>
    </div>
  );
}

function Video({ stream }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  if (!stream) return null;
  return <video ref={ref} className="spiegel__video" autoPlay playsInline muted />;
}

export function Ontwerper() {
  const { cfg, zet, logo, setLogo } = useOntwerp();
  const [stream, setStream] = useState(null);
  const [logoFout, setLogoFout] = useState('');

  const kiesLogo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return setLogoFout('Kies een logo kleiner dan 2 MB.');
    setLogoFout('');
    const r = new FileReader();
    r.onload = () => setLogo(r.result);
    r.readAsDataURL(f);
  };

  const formaten = Object.fromEntries(VORMEN[cfg.vorm].formaten.map((f) => [f.id, `${f.maat} · ${euro(f.prijs)}`]));
  const ledOpties = Object.fromEntries(Object.entries(LED).map(([id, l]) => [id, l.prijs ? `${l.label} +${euro(l.prijs)}` : l.label]));

  return (
    <section className="ontwerp" id="ontwerp">
      <div className="ontwerp__kop">
        <h2>Ontwerp je spiegel.</h2>
        <p>Je ziet meteen hoe hij wordt. Tik op het hartje, of kijk er zelf in.</p>
      </div>

      <div className="ontwerp__beeld">
        <Muur foto="/foto/salon.jpg" kleur="var(--kobalt-diep)" cfg={cfg} logo={logo} video={<Video stream={stream} />} interactief />
        <Camera onStream={setStream} />
      </div>

      <div className="paneel">
        <div className="groep">
          <h3>Jouw account</h3>
          <div className="veld-rij">
            <label className="veld">
              <span>Accountnaam</span>
              <span className="veld__at">
                <i>@</i>
                <input value={cfg.naam} maxLength={24} onChange={(e) => zet('naam', e.target.value.replace(/[\s@]/g, '').toLowerCase())} />
              </span>
            </label>
            <label className="veld">
              <span>Regel eronder</span>
              <input value={cfg.ondertitel} maxLength={32} onChange={(e) => zet('ondertitel', e.target.value)} />
            </label>
          </div>
          <div className="veld-rij">
            <label className="veld">
              <span>Logo</span>
              <span className="upload">
                {logo ? <img src={logo} alt="" /> : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v5h16v-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
                {logo ? 'Kies een ander logo' : 'Upload je logo'}
                <input type="file" accept="image/*" onChange={kiesLogo} />
              </span>
              {logoFout && <em className="fout">{logoFout}</em>}
            </label>
            <div className="veld-rij veld-rij--krap">
              <label className="veld">
                <span>Likes</span>
                <input type="number" min="0" max="99000000" value={cfg.likes} onChange={(e) => zet('likes', e.target.value)} />
              </label>
              <label className="veld">
                <span>Reacties</span>
                <input type="number" min="0" max="99000000" value={cfg.reacties} onChange={(e) => zet('reacties', e.target.value)} />
              </label>
            </div>
          </div>
        </div>

        <div className="groep">
          <h3>Vorm en maat</h3>
          <Keuze label="Vorm" waarde={cfg.vorm} opties={{ telefoon: 'Telefoon', post: 'Post' }} onKies={(v) => zet('vorm', v)} />
          <Keuze label="Formaat" waarde={cfg.formaat} opties={formaten} onKies={(v) => zet('formaat', v)} />
        </div>

        <div className="groep">
          <h3>Kleur en licht</h3>
          <Kaderkleur />
          <Keuze label="Licht" waarde={cfg.led} opties={ledOpties} onKies={(v) => zet('led', v)} />
        </div>

        <div className="totaal">
          <div>
            <span className="totaal__prijs">{euro(prijsVan(cfg))}</span>
            <span className="totaal__uitleg">{formaatVan(cfg).maat} · {LED[cfg.led].label} · incl. btw</span>
          </div>
          <a className="knop knop--roze knop--groot" href="#bestellen">Bestel je spiegel</a>
        </div>
        <Zekerheid />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- voorbeelden */
export function Voorbeelden({ items }) {
  const { setCfg } = useOntwerp();
  const gebruik = (cfg) => {
    setCfg((c) => ({ ...c, ...cfg }));
    document.getElementById('ontwerp')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="voorbeelden">
      <h2>Zo hangt hij bij anderen.</h2>
      <div className="voorbeelden__rij">
        {items.map((v) => (
          <figure key={v.tag}>
            <Muur foto={v.foto} kleur={v.kleur} cfg={v.cfg} />
            <figcaption>
              <span><b>{v.tag}</b>{VORMEN[v.cfg.vorm].label} · {kaderNaam(v.cfg)} · {LED[v.cfg.led].label}</span>
              <button type="button" className="knop knop--inkt knop--klein" onClick={() => gebruik(v.cfg)}>Gebruik dit ontwerp</button>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- bestellen */
export function Bestellen() {
  const { cfg, logo } = useOntwerp();
  const [staat, setStaat] = useState({ fase: 'leeg', melding: '' });

  const verstuur = async (e) => {
    e.preventDefault();
    const velden = Object.fromEntries(new FormData(e.currentTarget));
    setStaat({ fase: 'bezig', melding: '' });
    try {
      const res = await fetch('/api/aanvraag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cfg, logo, contact: velden }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.fout || 'Bestellen lukte niet. Probeer het opnieuw.');
      setStaat({ fase: 'klaar', melding: velden.email });
    } catch (err) {
      setStaat({ fase: 'fout', melding: err.message });
    }
  };

  return (
    <section className="bestellen" id="bestellen">
      <div className="bestellen__kop">
        <h2>Bijna klaar.</h2>
        <p>Laat je gegevens achter. Je krijgt eerst een digitale proef. We maken hem pas, en je betaalt pas, als jij akkoord geeft.</p>
        <div className="bon">
          <div className="bon__mini">
            <Spiegel cfg={cfg} logo={logo} />
          </div>
          <dl>
            <div><dt>Account</dt><dd>@{cfg.naam || 'jouwnaam'}</dd></div>
            <div><dt>Vorm</dt><dd>{VORMEN[cfg.vorm].label}, {formaatVan(cfg).maat}</dd></div>
            <div><dt>Kader</dt><dd>{kaderNaam(cfg)}</dd></div>
            <div><dt>Licht</dt><dd>{LED[cfg.led].label}</dd></div>
            <div><dt>Logo</dt><dd>{logo ? 'Geüpload' : 'Nog geen logo'}</dd></div>
            <div className="bon__totaal"><dt>Totaal</dt><dd>{euro(prijsVan(cfg))}</dd></div>
          </dl>
          <a className="bon__terug" href="#ontwerp">Pas je ontwerp aan</a>
        </div>
      </div>

      {staat.fase === 'klaar' ? (
        <div className="bedankt" role="status">
          <h3>Bestelling ontvangen.</h3>
          <p>Je proef komt binnen één werkdag naar {staat.melding}. Keur je hem goed, dan gaan we maken.</p>
        </div>
      ) : (
        <form className="formulier" onSubmit={verstuur}>
          <label className="veld"><span>Je naam</span><input name="naam" required autoComplete="name" /></label>
          <label className="veld"><span>Bedrijf</span><input name="bedrijf" autoComplete="organization" /></label>
          <label className="veld"><span>E-mail</span><input name="email" type="email" required autoComplete="email" /></label>
          <label className="veld"><span>Telefoon</span><input name="telefoon" type="tel" autoComplete="tel" /></label>
          <label className="veld veld--breed"><span>Opmerking</span><textarea name="opmerking" rows={3} placeholder="Ander formaat, logo in het kader, levering voor een opening?" /></label>
          {staat.fase === 'fout' && <p className="fout veld--breed" role="alert">{staat.melding}</p>}
          <button className="knop knop--roze knop--groot veld--breed" disabled={staat.fase === 'bezig'}>
            {staat.fase === 'bezig' ? 'Bestelling versturen...' : `Bestel je spiegel · ${euro(prijsVan(cfg))}`}
          </button>
          <div className="veld--breed"><Zekerheid /></div>
        </form>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- mobiele balk */
export function MobielBalk() {
  const { cfg } = useOntwerp();
  const [zicht, setZicht] = useState(false);

  useEffect(() => {
    const ontwerp = document.getElementById('ontwerp');
    const bestel = document.getElementById('bestellen');
    if (!ontwerp || !bestel) return;
    const staat = { ontwerp: false, bestel: false };
    const io = new IntersectionObserver((items) => {
      items.forEach((i) => { staat[i.target === ontwerp ? 'ontwerp' : 'bestel'] = i.isIntersecting; });
      setZicht(staat.ontwerp && !staat.bestel);
    });
    io.observe(ontwerp);
    io.observe(bestel);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`mobielbalk${zicht ? ' is-zicht' : ''}`} aria-hidden={!zicht}>
      <span><b>{euro(prijsVan(cfg))}</b>{formaatVan(cfg).maat}</span>
      <a className="knop knop--roze" href="#bestellen" tabIndex={zicht ? 0 : -1}>Bestel je spiegel</a>
    </div>
  );
}
