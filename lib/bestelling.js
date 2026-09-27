import { euro, formaatVan, HEX, KADERS, kaderNaam, LED, prijsVan, VORMEN } from '@/lib/spiegel';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function controleer(cfg, contact) {
  const kaderOk = cfg && (KADERS[cfg.kader] || (cfg.kader === 'eigen' && HEX.test(cfg.kaderKleur ?? '')));
  if (!cfg || !VORMEN[cfg.vorm] || !LED[cfg.led] || !kaderOk) return 'Je ontwerp is niet compleet. Kies vorm, licht en kader.';
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
    ['Vorm', `${VORMEN[cfg.vorm].label}, ${formaatVan(cfg).maat}`], ['Licht', LED[cfg.led].label], ['Kader', kaderNaam(cfg)],
    ['Prijs', euro(prijsVan(cfg))], ['Opmerking', contact.opmerking], ...extra,
  ];
}

export const tabel = (r) => `<table>${r.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>`;

// Mail naar de werkplaats. Zonder Resend-instellingen slaat hij over en meldt dat in de log.
export async function mail({ onderwerp, html, logo, antwoordNaar }) {
  const { RESEND_API_KEY, BESTELLING_NAAR, MAIL_VAN } = process.env;
  if (!RESEND_API_KEY || !BESTELLING_NAAR || !MAIL_VAN) {
    console.warn('mail overgeslagen: RESEND_API_KEY, BESTELLING_NAAR of MAIL_VAN ontbreekt');
    return false;
  }
  const bijlage = typeof logo === 'string' && logo.match(/^data:image\/(\w+);base64,(.+)$/);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: MAIL_VAN, to: BESTELLING_NAAR, reply_to: antwoordNaar, subject: onderwerp, html,
      attachments: bijlage ? [{ filename: `logo.${bijlage[1]}`, content: bijlage[2] }] : undefined,
    }),
  });
  if (!res.ok) console.error('resend', res.status, await res.text());
  return res.ok;
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
