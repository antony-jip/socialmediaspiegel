import { Voorbeelden } from '@/components/Ontwerp';
import { Paginakop, Slotblok } from '@/components/Blokken';
import { VOORBEELDEN } from '@/lib/inhoud';

export const metadata = { title: 'Voorbeelden', description: 'Zo hangt de socialmediaspiegel bij kappers, nagelstudio’s, barbers en horeca. Kies een ontwerp en maak hem van jou.' };

export default function VoorbeeldenPagina() {
  return (
    <>
      <Paginakop sticker="Voorbeelden" titel="Kies er een. Maak hem van jou." lead="Zie iets dat je bevalt? Tik op Gebruik dit ontwerp en pas naam, logo en kleur aan." kleur="roze" />
      <Voorbeelden items={VOORBEELDEN} titel="Per branche." />
      <Slotblok />
    </>
  );
}
