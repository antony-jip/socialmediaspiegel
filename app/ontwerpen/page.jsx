import { Bestellen, MobielBalk, Ontwerper } from '@/components/Ontwerp';

export const metadata = { title: 'Ontwerp je spiegel', description: 'Ontwerp je eigen spiegel: naam, logo, kaderkleur en licht. Je ziet meteen hoe hij wordt.' };

export default function Ontwerpen() {
  return (
    <>
      <Ontwerper />
      <Bestellen />
      <MobielBalk />
    </>
  );
}
