import { euro, formaatVan, KADERS, LED, prijsVan, VORMEN } from '@/lib/spiegel';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export async function POST(req) {
  const { cfg, logo, contact } = await req.json().catch(() => ({}));
  if (!cfg || !VORMEN[cfg.vorm] || !LED[cfg.led] || !KADERS[cfg.kader]) {
    return Response.json({ fout: 'Je ontwerp is niet compleet. Kies vorm, licht en kader.' }, { status: 400 });
  }
  if (!contact?.naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email ?? '')) {
    return Response.json({ fout: 'Vul je naam en een geldig e-mailadres in.' }, { status: 400 });
  }
  const { RESEND_API_KEY, AANVRAAG_NAAR, MAIL_VAN } = process.env;
  if (!RESEND_API_KEY || !AANVRAAG_NAAR || !MAIL_VAN) {
    return Response.json({ fout: 'Aanvragen werkt nog niet: de mailkoppeling ontbreekt.' }, { status: 503 });
  }

  const rijen = [
    ['Naam', contact.naam], ['Bedrijf', contact.bedrijf], ['E-mail', contact.email], ['Telefoon', contact.telefoon],
    ['Account', `@${cfg.naam}`], ['Regel eronder', cfg.ondertitel], ['Likes / reacties', `${cfg.likes} / ${cfg.reacties}`],
    ['Vorm', `${VORMEN[cfg.vorm].label}, ${formaatVan(cfg).maat}`], ['Licht', LED[cfg.led].label], ['Kader', KADERS[cfg.kader]],
    ['Prijs', euro(prijsVan(cfg))], ['Opmerking', contact.opmerking],
  ];
  const html = `<h2>Nieuwe spiegelaanvraag</h2><table>${rijen
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`)
    .join('')}</table>`;

  const bijlage = typeof logo === 'string' && logo.match(/^data:image\/(\w+);base64,(.+)$/);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: MAIL_VAN,
      to: AANVRAAG_NAAR,
      reply_to: contact.email,
      subject: `Spiegelaanvraag @${cfg.naam} · ${euro(prijsVan(cfg))}`,
      html,
      attachments: bijlage ? [{ filename: `logo.${bijlage[1]}`, content: bijlage[2] }] : undefined,
    }),
  });
  if (!res.ok) {
    console.error('resend', res.status, await res.text());
    return Response.json({ fout: 'Versturen lukte niet. Probeer het over een minuut opnieuw.' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
