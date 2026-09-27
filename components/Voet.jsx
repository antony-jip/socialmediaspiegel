import Link from 'next/link';
import { Beeldmerk, Decor, Glans, Logo } from '@/components/Merk';
import { NAV } from '@/lib/inhoud';

export default function Voet() {
  return (
    <footer className="voet">
      <Glans className="voet__glans" />
      <Decor items={[['ster', 'var(--geel)', 70, 12, 40], ['hart', 'var(--roze)', 88, 40, 34, 12], ['ster', 'var(--roze)', 58, 58, 22], ['at', 'rgba(255,255,255,.5)', 94, 8, 28]]} />
      <div className="voet__merk">
        <Beeldmerk className="voet__beeldmerk" />
        <p className="voet__slogan">Word <span className="storytekst">gepost.</span></p>
        <Link className="knop knop--roze knop--groot" href="/ontwerpen">Ontwerp de jouwe</Link>
      </div>
      <nav className="voet__nav" aria-label="Voettekst">
        <Link href="/">Home</Link>
        {NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className="voet__regel">
        <Logo />
        <span>Een product van <a href="https://signcompany.nl">Sign Company</a></span>
      </div>
    </footer>
  );
}
