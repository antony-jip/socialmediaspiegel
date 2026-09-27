import { klantmailBetaald, mail, mollie, tabel } from '@/lib/bestelling';

// Mollie stuurt alleen een id; de status halen we zelf op, dus een vals verzoek kan niets aanrichten.
export async function POST(req) {
  const id = (await req.formData().catch(() => null))?.get('id');
  if (typeof id !== 'string' || !/^tr_[A-Za-z0-9]+$/.test(id)) return new Response('ok');
  try {
    const b = await mollie(`payments/${id}`);
    if (b.status === 'paid') {
      const m = b.metadata ?? {};
      await Promise.all([
        mail({
          onderwerp: `Betaald: @${m.account} · € ${b.amount.value} · proef sturen`,
          html: `<h2>Bestelling betaald (${b.id})</h2>${tabel(Object.entries(m))}`,
          antwoordNaar: m.email,
        }),
        m.email && mail({
          aan: m.email,
          onderwerp: 'Je betaling is binnen',
          html: klantmailBetaald({ naam: m.naam, bedrag: b.amount.value, omschrijving: b.description }),
        }),
      ]);
    }
  } catch (e) {
    console.error(e);
    return new Response('fout', { status: 500 }); // Mollie probeert het later opnieuw
  }
  return new Response('ok');
}
