// Genereert sfeerfoto's van lege muren via fal.ai; de site tekent de spiegel er live overheen.
// Gebruik: zet FAL_KEY in .env.local, dan: node --env-file=.env.local scripts/fal-beeld.mjs [scene]
import { writeFile, mkdir } from 'node:fs/promises';

const MODEL = 'fal-ai/nano-banana-2';
const BASIS =
  'Straight-on frontal interior photograph at eye level, camera perfectly parallel to the wall, no perspective distortion. ' +
  'The center of the wall is completely empty and bare, a large clean area with nothing hanging on it. ' +
  'Bright even daylight, crisp, soft pastel color, airy and fresh, real photography, 35mm, sharp. ' +
  'Absolutely no text, no words, no letters, no logos, no signs, no mirrors, no frames, no pictures, no posters on the wall.';

const SCENES = {
  salon: 'A beauty salon wall painted in soft blush pink pastel. At the bottom edge a cream boucle salon chair on the left and a tall green plant in a white pot on the right, both small in frame. Light oak floor.',
  kapper: 'A hair salon wall painted in soft sage mint pastel green. At the bottom edge the top of a cognac leather barber chair on the right and a small white trolley with combs on the left, both small in frame.',
  nagels: 'A nail studio wall painted in soft lilac lavender pastel. At the bottom edge a white nail table with a small arched lamp and a few pastel nail polish bottles, small in frame.',
  horeca: 'A cafe wall painted in soft butter yellow pastel with a thin white wainscot. At the bottom edge a light wooden bench with a peach cushion and a small round marble table with a latte, small in frame.',
  wimpers: 'A lash and brow studio wall painted in soft powder blue pastel. At the bottom edge a white treatment bed with a folded peach towel and a small ring light, small in frame.',
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
