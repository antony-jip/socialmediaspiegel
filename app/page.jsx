import { Hero, Reclame, Terugverdienen, Voorbeelden } from '@/components/Ontwerp';
import { Band, Slotblok, Stappen } from '@/components/Blokken';
import { VOORBEELDEN } from '@/lib/inhoud';

export default function Home() {
  return (
    <>
      <Hero />
      <Band />
      <Reclame />
      <Terugverdienen />
      <Voorbeelden items={VOORBEELDEN.slice(0, 3)} meer />
      <Stappen />
      <Slotblok />
    </>
  );
}
