import { controleer, klantmailOntwerp, mail, mollie, omschrijving, rijen, tabel } from '@/lib/bestelling';
import { euro, formaatVan, kaderNaam, LED, prijsVan, VORMEN } from '@/lib/spiegel';
import { maakVoorbeeld } from '@/lib/voorbeeld';

export async function POST(req) {
  const { cfg, logo, contact } = await req.json().catch(() => ({}));
  const fout = controleer(cfg, contact);
  if (fout) return Response.json({ fout }, { status: 400 });
  if (!process.env.MOLLIE_API_KEY) return Response.json({ fout: 'Betalen werkt nog niet: de Mollie-koppeling ontbreekt.' }, { status: 503 });

  const site = process.env.SITE_URL || new URL(req.url).origin;
  const bedrag = prijsVan(cfg); // altijd op de server berekend, nooit uit de browser overnemen
  let betaling;
  try {
    betaling = await mollie('payments', {
      method: 'POST',
      body: JSON.stringify({
        amount: { currency: 'EUR', value: bedrag.toFixed(2) },
        description: omschrijving(cfg),
        redirectUrl: `${site}/bedankt`,
        // Mollie kan localhost niet bereiken; de webhook alleen meesturen op een echte https-site.
        ...(site.startsWith('https://') ? { webhookUrl: `${site}/api/mollie-webhook` } : {}),
        locale: 'nl_NL',
        metadata: {
          naam: contact.naam?.slice(0, 80), email: contact.email?.slice(0, 120), telefoon: contact.telefoon?.slice(0, 30),
          bedrijf: contact.bedrijf?.slice(0, 80), account: cfg.naam, vorm: cfg.vorm, formaat: cfg.formaat, led: cfg.led,
          kader: cfg.kader === 'eigen' ? cfg.kaderKleur : cfg.kader, ondertitel: cfg.ondertitel?.slice(0, 40),
        },
      }),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ fout: 'De betaling kon niet worden gestart. Probeer het over een minuut opnieuw.' }, { status: 502 });
  }

  // Afbeelding van het ontwerp: voor de klant (bevestiging) en de werkplaats.
  let png = null;
  try { png = await maakVoorbeeld(cfg, logo); } catch (e) { console.error('voorbeeld', e); }
  const plaatje = png ? [{ filename: `socialmediaspiegel-${cfg.naam || 'ontwerp'}.png`, content: png.toString('base64') }] : [];
  const specs = [
    ['Account', `@${cfg.naam}`], ['Model', `${VORMEN[cfg.vorm].label}, ${formaatVan(cfg).maat}`],
    ['Kader', kaderNaam(cfg)], ['Licht', LED[cfg.led].label], ['Prijs', euro(bedrag)],
  ];

  await Promise.all([
    mail({
      onderwerp: `Nieuwe bestelling @${cfg.naam} · ${euro(bedrag)} · wacht op betaling`,
      html: `<h2>Nieuwe bestelling (${betaling.id})</h2>${tabel(rijen(cfg, contact, [['Mollie', betaling.id]]))}`,
      logo, bijlagen: plaatje, antwoordNaar: contact.email,
    }),
    mail({
      aan: contact.email,
      onderwerp: `Je ontwerp voor ${VORMEN[cfg.vorm].label} is binnen`,
      html: klantmailOntwerp({ contact, specs, checkout: betaling._links.checkout.href }),
      bijlagen: plaatje,
    }),
  ]).catch((e) => console.error(e));

  return Response.json({ id: betaling.id, checkout: betaling._links.checkout.href });
}
