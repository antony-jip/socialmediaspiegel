import Link from 'next/link';
import { Logo } from '@/components/Merk';
import { NAV } from '@/lib/inhoud';

export default function Voet() {
  return (
    <footer className="voet">
      <div className="voet__slot">
        <p className="voet__slogan">Word gepost<span className="punt">.</span></p>
        <Link className="knop knop--framboos" href="/ontwerpen">Ontwerp de jouwe</Link>
      </div>
      <div className="voet__regel">
        <Logo />
        <nav aria-label="Voettekst">
          <Link href="/">Profiel</Link>
          {NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <span>Een product van <a href="https://signcompany.nl">Sign Company</a></span>
      </div>
    </footer>
  );
}
