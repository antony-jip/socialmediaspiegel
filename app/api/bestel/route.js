import { controleer, mail, mollie, omschrijving, rijen, tabel } from '@/lib/bestelling';
import { euro, prijsVan } from '@/lib/spiegel';

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
          kader: cfg.kader === 'eigen' ? cfg.kaderKleur : cfg.kader,
        },
      }),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ fout: 'De betaling kon niet worden gestart. Probeer het over een minuut opnieuw.' }, { status: 502 });
  }

  // Ontwerp + logo alvast naar de werkplaats; de betaalstatus volgt via de webhook.
  await mail({
    onderwerp: `Nieuwe bestelling @${cfg.naam} · ${euro(bedrag)} · wacht op betaling`,
    html: `<h2>Nieuwe bestelling (${betaling.id})</h2>${tabel(rijen(cfg, contact, [['Mollie', betaling.id]]))}`,
    logo,
    antwoordNaar: contact.email,
  }).catch((e) => console.error(e));

  return Response.json({ id: betaling.id, checkout: betaling._links.checkout.href });
}
