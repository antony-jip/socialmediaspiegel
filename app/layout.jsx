import { Onest, Unbounded } from 'next/font/google';
import { OntwerpProvider, Verhaalbalk } from '@/components/Ontwerp';
import Kop from '@/components/Kop';
import Voet from '@/components/Voet';
import './globals.css';

const display = Unbounded({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--f-display' });
const tekst = Onest({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--f-tekst' });

export const metadata = {
  title: { default: 'Socialmediaspiegel · Word gepost.', template: '%s · Socialmediaspiegel' },
  description: 'Een spiegel in de vorm van een social post, met jouw naam en logo. Onverlicht of met LED- en RGB-licht. Voor salons, barbers en horeca.',
};

export const viewport = { themeColor: '#1b2cff' };

export default function RootLayout({ children }) {
  return (
    <html lang="nl" className={`${display.variable} ${tekst.variable}`}>
      <body>
        <OntwerpProvider>
          <Verhaalbalk />
          <Kop />
          <main>{children}</main>
          <Voet />
        </OntwerpProvider>
      </body>
    </html>
  );
}
