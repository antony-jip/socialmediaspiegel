import { Onest, Unbounded } from 'next/font/google';
import './globals.css';

const display = Unbounded({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--f-display' });
const tekst = Onest({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--f-tekst' });

export const metadata = {
  title: 'Socialmediaspiegel · spiegel met jouw naam en logo',
  description: 'Ontwerp je eigen spiegel in de vorm van een social post. Met jouw accountnaam en logo, onverlicht of met LED- en RGB-licht. Voor salons, barbers en horeca.',
};

export const viewport = { themeColor: '#1b2cff' };

export default function RootLayout({ children }) {
  return (
    <html lang="nl" className={`${display.variable} ${tekst.variable}`}>
      <body>{children}</body>
    </html>
  );
}
