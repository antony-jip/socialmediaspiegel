import { ImageResponse } from 'next/og';
import { formaatVan, kaderKleur, kaderNaam, kort, LED, opKader, VORMEN } from '@/lib/spiegel';

// Maakt een PNG van het ontwerp, voor de bevestigingsmail en de werkplaats. Zelfde opbouw als de preview op de site.
const GLOED = {
  uit: '0 24px 60px rgba(35, 27, 51, 0.25)',
  warm: '0 0 40px 14px rgba(255, 210, 150, 0.95), 0 0 150px 60px rgba(255, 185, 105, 0.45)',
  koel: '0 0 40px 14px rgba(225, 240, 255, 0.95), 0 0 150px 60px rgba(160, 205, 255, 0.5)',
  rgb: '0 0 40px 14px rgba(255, 120, 180, 0.95), 0 0 150px 60px rgba(170, 130, 255, 0.5)',
};

const Icoon = ({ d, kleur, vol = false, maat = 30 }) => (
  <svg width={maat} height={maat} viewBox="0 0 24 24">
    <path d={d} fill={vol ? kleur : 'none'} stroke={kleur} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
const HART = 'M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.7 1.1 4.8 2.8 1.1-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z';
const REACTIE = 'M20.5 11.6a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.4-4.5a8.4 8.4 0 1 1 15.6-4.4z';
const DEEL = 'M21 3 10 14M21 3l-6.8 18-4.2-7-7-4.2z';
const BEWAAR = 'M6 3.5h12v17l-6-4.3-6 4.3z';
const TABS = ['M3.5 10.5 12 4l8.5 6.5V20h-5.5v-6h-6v6H3.5z', 'M10.5 17.5a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM15.5 15.5l5 5', 'M4 4h16v16H4zM12 8v8M8 12h8', 'M4 5h16v14H4zM10 9l5 3-5 3z'];

function bruikbaarLogo(logo) {
  return typeof logo === 'string' && /^data:image\/(png|jpe?g);base64,/.test(logo) ? logo : null;
}

export async function maakVoorbeeld(cfg, logo) {
  const telefoon = cfg.vorm === 'telefoon';
  const breed = telefoon ? 380 : 560;
  const hoog = telefoon ? 760 : 700;
  const kader = kaderKleur(cfg);
  const op = opKader(kader);
  const accent = kader.toLowerCase() === '#e23b7e' ? '#ffffff' : '#e23b7e';
  const beeld = bruikbaarLogo(logo);
  const initiaal = (cfg.naam || '?').charAt(0).toUpperCase();

  const res = new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', background: '#f3effb', padding: '56px 60px', fontFamily: 'sans-serif', color: '#231b33' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', fontSize: 26 }}>
          <span style={{ fontWeight: 700 }}>Jouw ontwerp</span>
          <span style={{ color: '#6e6680' }}>socialmediaspiegel</span>
        </div>

        <div style={{ display: 'flex', width: breed, height: hoog, borderRadius: telefoon ? 52 : 30, border: '11px solid #17131f', background: kader, color: op, boxShadow: GLOED[cfg.led] ?? GLOED.uit, flexDirection: 'column', padding: 20, gap: 14 }}>
          {telefoon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, fontWeight: 700, padding: '0 8px' }}>
              <span>9:41</span>
              <div style={{ display: 'flex', width: 96, height: 26, borderRadius: 13, background: '#000' }} />
              <div style={{ display: 'flex', width: 26, height: 13, border: `2px solid ${op}`, borderRadius: 4 }} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', width: 46, height: 46, borderRadius: 23, border: `3px solid ${accent}`, background: '#e6ddfb', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: 22, fontWeight: 800, color: '#231b33' }}>
              {beeld ? <img src={beeld} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 20 }} /> : initiaal}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 19, fontWeight: 700 }}>{cfg.naam || 'jouwnaam'}</span>
              {cfg.ondertitel ? <span style={{ fontSize: 14, opacity: 0.65 }}>{cfg.ondertitel}</span> : null}
            </div>
          </div>
          <div style={{ display: 'flex', flexGrow: 1, borderRadius: 4, background: 'linear-gradient(160deg, #dde2e9 0%, #f7f8fa 28%, #c6ccd4 55%, #eef0f3 76%, #bac2cb 100%)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700 }}>
            <Icoon d={HART} kleur={accent} vol />
            <span style={{ marginRight: 8 }}>{kort(cfg.likes)}</span>
            <Icoon d={REACTIE} kleur={op} />
            <span style={{ marginRight: 8 }}>{kort(cfg.reacties)}</span>
            <Icoon d={DEEL} kleur={op} />
            <div style={{ display: 'flex', marginLeft: 'auto' }}><Icoon d={BEWAAR} kleur={op} /></div>
          </div>
          {telefoon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px' }}>
              {TABS.map((d) => <Icoon key={d} d={d} kleur={op} maat={26} />)}
              <div style={{ display: 'flex', width: 26, height: 26, borderRadius: 13, background: '#e6ddfb' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 30, fontWeight: 800 }}>{VORMEN[cfg.vorm].label} · {formaatVan(cfg).maat}</span>
          <span style={{ fontSize: 22, color: '#6e6680' }}>Kader {kaderNaam(cfg).toLowerCase()} · {LED[cfg.led].label} · echt spiegelglas</span>
        </div>
      </div>
    ),
    { width: 1000, height: 1250 },
  );
  return Buffer.from(await res.arrayBuffer());
}
