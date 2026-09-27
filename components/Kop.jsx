'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Merk';
import { NAV } from '@/lib/inhoud';

export default function Kop() {
  const pad = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pad]);

  return (
    <header className={`balk${open ? ' is-open' : ''}`}>
      <Link href="/" aria-label="Socialmediaspiegel, naar de homepage"><Logo /></Link>
      <nav className="balk__nav" id="menu">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} className={pad === href ? 'is-hier' : ''} aria-current={pad === href ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>
      <Link className="knop knop--roze knop--klein balk__cta" href="/ontwerpen">Ontwerp de jouwe</Link>
      <button type="button" className="balk__menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
        <span />
        <span className="sr">{open ? 'Sluit menu' : 'Open menu'}</span>
      </button>
    </header>
  );
}
