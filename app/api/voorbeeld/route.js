import { HEX, KADERS, LED, START, VORMEN } from '@/lib/spiegel';
import { maakVoorbeeld } from '@/lib/voorbeeld';

// GET /api/voorbeeld?cfg=<base64url json>: dezelfde afbeelding als in de bevestigingsmail (zonder logo).
export async function GET(req) {
  let cfg = START;
  try {
    const ruw = new URL(req.url).searchParams.get('cfg');
    if (ruw) cfg = { ...START, ...JSON.parse(Buffer.from(ruw, 'base64url').toString('utf8')) };
  } catch {
    return new Response('Ongeldig ontwerp', { status: 400 });
  }
  const kaderOk = KADERS[cfg.kader] || (cfg.kader === 'eigen' && HEX.test(cfg.kaderKleur ?? ''));
  if (!VORMEN[cfg.vorm] || !LED[cfg.led] || !kaderOk) return new Response('Ongeldig ontwerp', { status: 400 });
  const png = await maakVoorbeeld(cfg, null);
  return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' } });
}
