// Korte reel (5 s) uit een beeld via Kling image-to-video. Kosten ongeveer $0,56 per clip.
// Gebruik: node --env-file=.env.local scripts/fal-reel.mjs <beeld> <uit.mp4> "<prompt>"
import { readFile, writeFile } from 'node:fs/promises';

const [bron, doel, prompt] = process.argv.slice(2);
const key = process.env.FAL_KEY;
if (!key || !bron || !doel || !prompt) throw new Error('gebruik: fal-reel.mjs <beeld> <uit.mp4> "<prompt>"');
const kop = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' };
const id = 'fal-ai/kling-video/v3/pro/image-to-video';

const start = `data:image/jpeg;base64,${(await readFile(bron)).toString('base64')}`;
const aanvraag = await fetch(`https://queue.fal.run/${id}`, {
  method: 'POST', headers: kop,
  body: JSON.stringify({
    prompt, start_image_url: start, duration: '5', generate_audio: false,
    negative_prompt: 'text, letters, logo, watermark, distorted hands, extra fingers, warped reflection, flicker',
  }),
});
if (!aanvraag.ok) throw new Error(`${aanvraag.status} ${await aanvraag.text()}`);
const { status_url, response_url } = await aanvraag.json();

for (let i = 0; i < 90; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  const st = await (await fetch(status_url, { headers: kop })).json();
  if (st.status === 'COMPLETED') break;
  if (st.status === 'FAILED' || st.error) throw new Error(JSON.stringify(st));
}
const res = await (await fetch(response_url, { headers: kop })).json();
const url = res?.video?.url;
if (!url) throw new Error(`geen video: ${JSON.stringify(res).slice(0, 300)}`);
const mp4 = Buffer.from(await (await fetch(url)).arrayBuffer());
await writeFile(doel, mp4);
console.log(`${doel}: ${(mp4.length / 1024).toFixed(0)} kB`);
