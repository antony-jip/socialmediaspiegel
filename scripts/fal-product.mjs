// Fotorealistische sfeerbeelden van de spiegel in gebruik. Tijdelijk: vervangen door echte foto's van het proefstuk.
// Gebruik: node --env-file=.env.local scripts/fal-product.mjs [naam]
import { writeFile, mkdir } from 'node:fs/promises';

const MODEL = 'fal-ai/nano-banana-2';
const SPIEGEL =
  'a tall wall mirror shaped exactly like a smartphone screen: rounded rectangle frame about 60 by 120 cm, ' +
  'a small black pill shape at the top of the frame, a thin row of tiny line icons (heart, speech bubble, paper plane) printed along the bottom edge of the frame, ' +
  'real mirror glass filling the middle';
const STIJL = 'Editorial lifestyle photography, natural daylight, 35mm, shallow depth of field, soft pastel interior, realistic reflections. Absolutely no readable text, no letters, no logos, no watermarks.';

const BEELDEN = {
  selfie: `A young woman with a phone taking a mirror selfie in a bright blush-pink beauty salon, standing in front of ${SPIEGEL}, white frame, soft warm LED glow behind the mirror on the wall. Her reflection is visible in the mirror glass. ${STIJL}`,
  detail: `Close-up product photo of the lower right corner of a white smartphone-shaped wall mirror frame: ONE single continuous sheet of mirror glass sits perfectly flush inside the white frame, no dividers, no second pane, crisp clean edge, tiny line icons of a heart and speech bubble printed on the white frame below the glass, a soft warm LED halo glowing on a lilac wall behind it. Macro, calm studio light. ${STIJL}`,
  barber: `A young man taking a mirror selfie in a sage green barbershop, standing in front of ${SPIEGEL}, matte black frame, warm LED glow behind it on the wall. His reflection is in the mirror glass. ${STIJL}`,
  cafe: `Seen from behind and slightly to the side: two friends taking a selfie together in front of ${SPIEGEL}, butter yellow frame, only tiny heart, speech bubble and paper plane icons along the bottom edge, no camera icon. Their faces are visible as a reflection in the mirror glass. Pastel cafe with a marble table and coffee cups. ${STIJL}`,
  nagels: `A smiling woman holding up her freshly painted pastel nails next to her face, admiring her reflection in ${SPIEGEL}, white frame, soft cool white LED glow behind it, lilac nail studio with a white nail table and pastel polish bottles. ${STIJL}`,
  kapper: `A hairdresser finishing a client's glossy blowout, the client in the salon chair seen from behind in the foreground, her smiling face visible as a reflection in ${SPIEGEL}, blush pink frame, only three tiny icons on the frame (heart, speech bubble, paper plane), no camera icon, warm LED glow behind it, bright cream and sage hair salon. ${STIJL}`,
  rgb: `Evening in a cozy lunchroom bar with warm dim lights and candles. In the foreground, seen from behind, two friends stand close together facing ${SPIEGEL}, white frame, one holds up her phone for a selfie. Their smiling faces are visible as a reflection in the mirror glass. A vivid magenta and violet RGB LED glow behind the mirror washes the brick wall in color. Editorial lifestyle photography, 35mm, physically correct mirror reflection. Absolutely no readable text, no letters, no logos, no watermarks.`,
  wimpers: `A woman with fresh lash extensions looking at herself in ${SPIEGEL}, lilac frame, cool white LED glow behind it, in a powder blue lash studio with a white treatment bed. ${STIJL}`,
};

const key = process.env.FAL_KEY;
if (!key) throw new Error('FAL_KEY ontbreekt in .env.local');
const kies = process.argv[2] ? [process.argv[2]] : Object.keys(BEELDEN);
await mkdir('public/beeld', { recursive: true });

await Promise.all(kies.map(async (naam) => {
  const res = await fetch(`https://fal.run/${MODEL}`, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: BEELDEN[naam], aspect_ratio: '4:5', resolution: '2K', output_format: 'jpeg', num_images: 1 }),
  });
  if (!res.ok) throw new Error(`${naam}: ${res.status} ${await res.text()}`);
  const url = (await res.json()).images[0].url;
  const img = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(`public/beeld/${naam}.jpg`, img);
  console.log(`${naam}: ${(img.length / 1024).toFixed(0)} kB`);
}));
