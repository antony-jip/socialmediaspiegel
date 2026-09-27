import { euro, formaatVan, HEX, KADERS, kaderNaam, LED, OPHANGEN, ophangVan, prijsVan, VORMEN } from '@/lib/spiegel';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function controleer(cfg, contact) {
  const kaderOk = cfg && (KADERS[cfg.kader] || (cfg.kader === 'eigen' && HEX.test(cfg.kaderKleur ?? '')));
  if (!cfg || !VORMEN[cfg.vorm] || !LED[cfg.led] || !kaderOk || (cfg.ophang && !OPHANGEN[cfg.ophang])) return 'Je ontwerp is niet compleet. Kies maat, licht, kader en ophangen.';
  if (cfg.ophang === 'lijm' && cfg.led !== 'uit') return 'Glow kan alleen met afstandhouders. Kies afstandhouders of zet het licht uit.';
  if (!contact?.naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email ?? '')) return 'Vul je naam en een geldig e-mailadres in.';
  return null;
}

export function omschrijving(cfg) {
  return `Socialmediaspiegel @${cfg.naam} · ${formaatVan(cfg).maat} · ${LED[cfg.led].label}`.slice(0, 250);
}

export function rijen(cfg, contact, extra = []) {
  return [
    ['Naam', contact.naam], ['Bedrijf', contact.bedrijf], ['E-mail', contact.email], ['Telefoon', contact.telefoon],
    ['Account', `@${cfg.naam}`], ['Regel eronder', cfg.ondertitel], ['Likes / reacties', `${cfg.likes} / ${cfg.reacties}`],
    ['Vorm', `${VORMEN[cfg.vorm].label}, ${formaatVan(cfg).maat}`], ['Licht', LED[cfg.led].label], ['Ophangen', ophangVan(cfg).label], ['Kader', kaderNaam(cfg)],
    ['Prijs', euro(prijsVan(cfg))], ['Opmerking', contact.opmerking], ...extra,
  ];
}

export const tabel = (r) => `<table>${r.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>`;

// Mail via Resend. Zonder `aan` gaat hij naar de werkplaats (BESTELLING_NAAR).
// Zonder Resend-instellingen slaat hij over en meldt dat in de log.
export async function mail({ aan, onderwerp, html, logo, bijlagen = [], antwoordNaar }) {
  const { RESEND_API_KEY, BESTELLING_NAAR, MAIL_VAN } = process.env;
  if (!RESEND_API_KEY || !BESTELLING_NAAR || !MAIL_VAN) {
    console.warn('mail overgeslagen: RESEND_API_KEY, BESTELLING_NAAR of MAIL_VAN ontbreekt');
    return false;
  }
  const logoBijlage = typeof logo === 'string' && logo.match(/^data:image\/(\w+);base64,(.+)$/);
  const alle = [
    ...(logoBijlage ? [{ filename: `logo.${logoBijlage[1]}`, content: logoBijlage[2] }] : []),
    ...bijlagen,
  ];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: MAIL_VAN, to: aan || BESTELLING_NAAR, reply_to: antwoordNaar || BESTELLING_NAAR, subject: onderwerp, html,
      attachments: alle.length ? alle : undefined,
    }),
  });
  if (!res.ok) console.error('resend', res.status, await res.text());
  return res.ok;
}

// Klantmails: je-vorm, kort, zonder streepjes.
const knopStijl = 'display:inline-block;padding:12px 20px;border-radius:10px;background:#e23b7e;color:#fff;text-decoration:none;font-weight:600';
const omhulsel = (inhoud) => `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#231b33;max-width:560px">${inhoud}<p style="margin-top:28px;color:#6e6680;font-size:13px">Socialmediaspiegel · een product van Sign Company</p></div>`;
const voornaam = (naam) => esc(String(naam || '').trim().split(/\s+/)[0] || '');

export function klantmailOntwerp({ contact, specs, checkout }) {
  return omhulsel(`
    <p>Hoi ${voornaam(contact.naam)},</p>
    <p>Dank je voor je bestelling. In de bijlage zie je hoe jouw spiegel eruit komt te zien.</p>
    ${tabel(specs)}
    <p style="margin-top:20px"><b>Zo gaat het verder</b></p>
    <ol style="padding-left:18px">
      <li>Zodra je betaling binnen is, maken we je digitale proef. Die krijg je binnen één werkdag.</li>
      <li>Klopt alles? Dan geef je akkoord en gaan we voor je maken.</li>
      <li>Binnen tien werkdagen na je akkoord is hij bij je.</li>
    </ol>
    ${checkout ? `<p>Nog niet betaald? Rond je betaling hier af:</p><p><a href="${checkout}" style="${knopStijl}">Betaling afronden</a></p>` : ''}
    <p>Vragen of iets aanpassen? Beantwoord gewoon deze mail.</p>`);
}

export function klantmailBetaald({ naam, bedrag, omschrijving }) {
  return omhulsel(`
    <p>Hoi ${voornaam(naam)},</p>
    <p>Je betaling van € ${esc(bedrag).replace('.', ',')} is binnen. Dank je wel!</p>
    <p>${esc(omschrijving)}</p>
    <p>Binnen één werkdag krijg je je digitale proef. Klopt alles, dan geef je akkoord en gaan we maken.</p>
    <p>Ophangen is makkelijk: in de doos zit een montagemal. Dopjes in de muur, spiegel erop klikken. Het stappenplan staat op socialmediaspiegel.nl/vragen.</p>
    <p>Vragen? Beantwoord gewoon deze mail.</p>`);
}

export async function mollie(pad, init = {}) {
  const res = await fetch(`https://api.mollie.com/v2/${pad}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`, 'Content-Type': 'application/json', ...init.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`mollie ${res.status}: ${data.detail || data.title || 'onbekend'}`);
  return data;
}
