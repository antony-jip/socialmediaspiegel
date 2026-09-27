import { mollie } from '@/lib/bestelling';

export async function GET(req) {
  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return Response.json({ fout: 'Onbekende betaling.' }, { status: 400 });
  try {
    const b = await mollie(`payments/${id}`);
    return Response.json({ status: b.status, bedrag: b.amount.value, omschrijving: b.description, email: b.metadata?.email });
  } catch {
    return Response.json({ fout: 'De betaalstatus kon niet worden opgehaald.' }, { status: 502 });
  }
}
