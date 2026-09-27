import { Gloock, Onest, Plus_Jakarta_Sans } from 'next/font/google';
import { OntwerpProvider } from '@/components/Ontwerp';
import Kop, { Tabbalk } from '@/components/Kop';
import Voet from '@/components/Voet';
import './globals.css';

const display = Gloock({ subsets: ['latin'], weight: '400', variable: '--f-display' });
const merk = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['800'], variable: '--f-merk' });
const tekst = Onest({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--f-tekst' });

export const metadata = {
  title: { default: 'Socialmediaspiegel · Word gepost.', template: '%s · Socialmediaspiegel' },
  description: 'Een echte spiegel in de vorm van een social post, met jouw naam en logo. Voor salons, barbers en horeca. Gemaakt bij Sign Company.',
};

export const viewport = { themeColor: '#fcfaff' };

export default function RootLayout({ children }) {
  return (
    <html lang="nl" className={`${display.variable} ${tekst.variable} ${merk.variable}`}>
      <body>
        <OntwerpProvider>
          <Kop />
          <main>{children}</main>
          <Voet />
          <Tabbalk />
        </OntwerpProvider>
      </body>
    </html>
  );
}
