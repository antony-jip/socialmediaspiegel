'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Merk';
import { NAV } from '@/lib/inhoud';

const ICOON = {
  '/': 'M3.5 10.5 12 4l8.5 6.5V20h-5.5v-6h-6v6H3.5z',
  '/voorbeelden': 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  '/ontwerpen': 'M12 5v14M5 12h14',
  '/ons-verhaal': 'M5 4h10l4 4v12H5z M9 12h6M9 16h4',
  '/vragen': 'M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5',
};

export default function Kop() {
  const pad = usePathname();
  return (
    <header className="kop">
      <Link href="/" aria-label="Socialmediaspiegel, naar het profiel"><Logo /></Link>
      <nav className="kop__nav" aria-label="Hoofdmenu">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} className={pad === href ? 'is-hier' : ''} aria-current={pad === href ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>
      <Link className="knop knop--framboos knop--klein kop__cta" href="/ontwerpen">Ontwerp de jouwe</Link>
    </header>
  );
}

// Onderbalk op mobiel, zoals in een app. Het plusje in het midden is 'nieuwe spiegel'.
export function Tabbalk() {
  const pad = usePathname();
  if (pad === '/ontwerpen') return null;
  const tabs = [['/', 'Profiel'], ['/voorbeelden', 'Voorbeelden'], ['/ontwerpen', 'Ontwerp'], ['/ons-verhaal', 'Verhaal'], ['/vragen', 'Vragen']];
  return (
    <nav className="tabbalk" aria-label="Snelmenu">
      {tabs.map(([href, label]) => (
        <Link key={href} href={href} className={`${pad === href ? 'is-hier' : ''}${href === '/ontwerpen' ? ' tabbalk__plus' : ''}`} aria-label={label}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICOON[href]} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
