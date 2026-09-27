'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Spiegel from '@/components/Spiegel';
import { euro, formaatVan, KADERS, LED, prijsVan, START, VORMEN } from '@/lib/spiegel';

const OntwerpCtx = createContext(null);
export const useOntwerp = () => useContext(OntwerpCtx);

export function OntwerpProvider({ children }) {
  const [cfg, setCfg] = useState(START);
  const [logo, setLogo] = useState(null);
  const zet = (k, v) => setCfg((c) => ({ ...c, [k]: v }));
  return <OntwerpCtx.Provider value={{ cfg, zet, logo, setLogo }}>{children}</OntwerpCtx.Provider>;
}

export function Muur({ foto, kleur, cfg, logo, video, interactief, children }) {
  return (
    <div className={`muur muur--${cfg.vorm} muur--${cfg.formaat}`} style={{ '--muur': kleur, backgroundImage: foto ? `url(${foto})` : undefined }}>
      <div className="muur__hanger">
        <Spiegel cfg={cfg} logo={logo} video={video} interactief={interactief} />
      </div>
      {children}
    </div>
  );
}

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
      <button type="button" className="knop knop--wit" onClick={wissel}>
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

  const formaten = Object.fromEntries(VORMEN[cfg.vorm].formaten.map((f) => [f.id, f.maat]));
  const ledOpties = Object.fromEntries(Object.entries(LED).map(([id, l]) => [id, l.prijs ? `${l.label} +${euro(l.prijs)}` : l.label]));

  return (
    <section className="ontwerp" id="ontwerp">
      <div className="ontwerp__tekst">
        <h1>Een spiegel die gepost wil worden.</h1>
        <p className="ontwerp__lead">Een LED-spiegel in de vorm van een social post, met jouw naam en logo erop. Je klanten maken er een selfie. Jij krijgt de tag.</p>

        <div className="paneel">
          <div className="veld-rij">
            <label className="veld">
              <span>Accountnaam</span>
              <input value={cfg.naam} maxLength={24} onChange={(e) => zet('naam', e.target.value.replace(/\s/g, '').toLowerCase())} />
            </label>
            <label className="veld">
              <span>Regel eronder</span>
              <input value={cfg.ondertitel} maxLength={32} onChange={(e) => zet('ondertitel', e.target.value)} />
            </label>
          </div>

          <div className="veld-rij">
            <label className="veld veld--upload">
              <span>Logo</span>
              <span className="upload">
                {logo ? <img src={logo} alt="" /> : null}
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

          <Keuze label="Vorm" waarde={cfg.vorm} opties={{ telefoon: 'Telefoon', post: 'Post' }} onKies={(v) => zet('vorm', v)} />
          <Keuze label="Formaat" waarde={cfg.formaat} opties={formaten} onKies={(v) => zet('formaat', v)} />
          <Keuze label="Licht" waarde={cfg.led} opties={ledOpties} onKies={(v) => zet('led', v)} />
          <Keuze label="Kader" waarde={cfg.kader} opties={KADERS} onKies={(v) => zet('kader', v)} />

          <div className="totaal">
            <div>
              <span className="totaal__prijs">{euro(prijsVan(cfg))}</span>
              <span className="totaal__uitleg">{formaatVan(cfg).maat} · incl. btw · gratis verzending</span>
            </div>
            <a className="knop knop--roze" href="#aanvraag">Vraag je spiegel aan</a>
          </div>
        </div>
      </div>

      <div className="ontwerp__beeld">
        <Muur foto="/foto/salon.jpg" kleur="var(--kobalt-diep)" cfg={cfg} logo={logo} video={<Video stream={stream} />} interactief />
        <Camera onStream={setStream} />
      </div>
    </section>
  );
}

export function Aanvraag() {
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
      if (!res.ok) throw new Error(data.fout || 'Versturen lukte niet. Probeer het opnieuw.');
      setStaat({ fase: 'klaar', melding: velden.email });
    } catch (err) {
      setStaat({ fase: 'fout', melding: err.message });
    }
  };

  return (
    <section className="aanvraag" id="aanvraag">
      <div className="aanvraag__kop">
        <h2>Klaar met ontwerpen?</h2>
        <p>Stuur je ontwerp in. Je krijgt eerst een digitale proef, en we maken hem pas als jij akkoord geeft.</p>
        <dl className="bon">
          <div><dt>Account</dt><dd>@{cfg.naam || 'jouwnaam'}</dd></div>
          <div><dt>Vorm</dt><dd>{VORMEN[cfg.vorm].label}, {formaatVan(cfg).maat}</dd></div>
          <div><dt>Licht</dt><dd>{LED[cfg.led].label}</dd></div>
          <div><dt>Kader</dt><dd>{KADERS[cfg.kader]}</dd></div>
          <div><dt>Logo</dt><dd>{logo ? 'Geüpload' : 'Nog geen logo'}</dd></div>
          <div className="bon__totaal"><dt>Totaal</dt><dd>{euro(prijsVan(cfg))}</dd></div>
        </dl>
      </div>

      {staat.fase === 'klaar' ? (
        <div className="bedankt" role="status">
          <h3>Aanvraag verstuurd.</h3>
          <p>Je proef komt binnen één werkdag naar {staat.melding}.</p>
        </div>
      ) : (
        <form className="formulier" onSubmit={verstuur}>
          <label className="veld"><span>Je naam</span><input name="naam" required autoComplete="name" /></label>
          <label className="veld"><span>Bedrijf</span><input name="bedrijf" autoComplete="organization" /></label>
          <label className="veld"><span>E-mail</span><input name="email" type="email" required autoComplete="email" /></label>
          <label className="veld"><span>Telefoon</span><input name="telefoon" type="tel" autoComplete="tel" /></label>
          <label className="veld veld--breed"><span>Opmerking</span><textarea name="opmerking" rows={3} placeholder="Ander formaat, eigen kleur, levering voor een opening?" /></label>
          {staat.fase === 'fout' && <p className="fout veld--breed" role="alert">{staat.melding}</p>}
          <button className="knop knop--roze veld--breed" disabled={staat.fase === 'bezig'}>
            {staat.fase === 'bezig' ? 'Aanvraag versturen...' : 'Verstuur je aanvraag'}
          </button>
        </form>
      )}
    </section>
  );
}
