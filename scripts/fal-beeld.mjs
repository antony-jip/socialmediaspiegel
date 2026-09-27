// Genereert sfeerfoto's van lege muren via fal.ai; de site tekent de spiegel er live overheen.
// Gebruik: zet FAL_KEY in .env.local, dan: node --env-file=.env.local scripts/fal-beeld.mjs [scene]
import { writeFile, mkdir } from 'node:fs/promises';

const MODEL = 'fal-ai/nano-banana-2';
const BASIS =
  'Straight-on frontal interior photograph at eye level, camera perfectly parallel to the wall, no perspective distortion. ' +
  'The center of the wall is completely empty and bare, a large clean area with nothing hanging on it. ' +
  'Bright even daylight, crisp, vivid saturated color, real photography, 35mm, sharp. ' +
  'Absolutely no text, no words, no letters, no logos, no signs, no mirrors, no frames, no pictures, no posters on the wall.';

const SCENES = {
  salon: 'A beauty salon wall painted in vivid cobalt blue. At the bottom edge a white leather salon chair on the left and a tall green plant on the right, both small in frame.',
  kapper: 'A hair salon wall painted in sunny saturated yellow. At the bottom edge the top of a black barber chair on the right and a small trolley with combs on the left, both small in frame.',
  nagels: 'A nail studio wall painted in hot pink. At the bottom edge a white nail table with a small lamp and a few nail polish bottles, small in frame.',
  horeca: 'A cafe wall with glossy emerald green square tiles. At the bottom edge a wooden bench with a mustard cushion and a small round table with a coffee cup, small in frame.',
};

const key = process.env.FAL_KEY;
if (!key) throw new Error('FAL_KEY ontbreekt in .env.local');
const kies = process.argv[2] ? [process.argv[2]] : Object.keys(SCENES);
await mkdir('public/foto', { recursive: true });

await Promise.all(
  kies.map(async (naam) => {
    const res = await fetch(`https://fal.run/${MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `${SCENES[naam]} ${BASIS}`,
        aspect_ratio: '4:5',
        resolution: '2K',
        output_format: 'jpeg',
        num_images: 1,
      }),
    });
    if (!res.ok) throw new Error(`${naam}: ${res.status} ${await res.text()}`);
    const url = (await res.json()).images[0].url;
    const img = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(`public/foto/${naam}.jpg`, img);
    console.log(`${naam}: ${(img.length / 1024).toFixed(0)} kB`);
  }),
);
