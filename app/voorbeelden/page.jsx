import { Voorbeelden } from '@/components/Ontwerp';
import { Paginakop, Slotblok } from '@/components/Blokken';
import { VOORBEELDEN } from '@/lib/inhoud';

export const metadata = { title: 'Voorbeelden', description: 'Zo hangt de socialmediaspiegel bij kappers, nagelstudio’s, barbers en horeca. Kies een ontwerp en maak hem van jou.' };

export default function VoorbeeldenPagina() {
  return (
    <>
      <Paginakop label="Voorbeelden" titel="Kies er een en maak hem van jou" lead="Zie je iets moois? Tik op Gebruik dit ontwerp en pas naam, logo en kleur aan." kleur="mint" />
      <Voorbeelden items={VOORBEELDEN} titel="Per branche" />
      <Slotblok />
    </>
  );
}
