import { esc, mail, tabel } from '@/lib/bestelling';

const SOORTEN = { meer: 'Meerdere spiegels', huur: 'Huren voor een evenement' };

export async function POST(req) {
  const d = await req.json().catch(() => ({}));
  if (!SOORTEN[d.soort]) return Response.json({ fout: 'Kies of je wilt kopen of huren.' }, { status: 400 });
  if (!d.naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email ?? '')) return Response.json({ fout: 'Vul je naam en een geldig e-mailadres in.' }, { status: 400 });
  const rijen = [
    ['Soort', SOORTEN[d.soort]], ['Naam', d.naam], ['Bedrijf', d.bedrijf], ['E-mail', d.email], ['Telefoon', d.telefoon],
    ['Aantal', d.aantal], ['Datum', d.datum], ['Plaats', d.plaats], ['Bericht', d.bericht],
  ].map(([k, v]) => [k, String(v ?? '').slice(0, 1000)]);
  const ok = await mail({
    onderwerp: `Zakelijke aanvraag: ${SOORTEN[d.soort]} · ${esc(d.bedrijf || d.naam)}`,
    html: `<h2>Zakelijke aanvraag</h2>${tabel(rijen)}`,
    antwoordNaar: d.email,
  });
  if (!ok) return Response.json({ fout: 'Versturen lukte niet. Probeer het over een minuut opnieuw.' }, { status: 502 });
  return Response.json({ ok: true });
}
