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
  barber: `A young man taking a mirror selfie in a sage green barbershop in front of a square wall mirror shaped like a social media post: black frame with a small round avatar circle top left and tiny white line icons along the bottom, warm LED glow behind it on the wall. His reflection is in the glass. ${STIJL}`,
  cafe: `Seen from behind and slightly to the side: two friends taking a selfie together in front of a square wall mirror shaped like a social media post, butter yellow frame, tiny heart and speech bubble line icons along the bottom edge only, nothing else printed on the frame, no camera icon. Their faces are visible as a reflection in the mirror glass. Pastel cafe with a marble table and coffee cups. ${STIJL}`,
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
