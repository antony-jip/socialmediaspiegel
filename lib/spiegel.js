// Eén model: De Story (telefoonvorm). Prijzen incl. btw, verhoogd 27 sep 2026 na kostprijsberekening (marge na arbeid was te krap).
export const VORMEN = {
  telefoon: {
    label: 'De Story',
    uitleg: 'Telefoonvorm',
    ratio: 0.5,
    formaten: [
      { id: 's', maat: '40 × 80 cm', prijs: 249 },
      { id: 'm', maat: '60 × 120 cm', prijs: 349 },
      { id: 'l', maat: '80 × 160 cm', prijs: 499 },
    ],
  },
};

export const VANAF = Math.min(...Object.values(VORMEN).flatMap((v) => v.formaten.map((f) => f.prijs)));

// Standaard onverlicht; licht is een optie. RGB met afstandsbediening.
export const LED = {
  uit: { label: 'Onverlicht', prijs: 0 },
  warm: { label: 'Glow warm', prijs: 89 },
  koel: { label: 'Glow koel', prijs: 89 },
  rgb: { label: 'Glow RGB', prijs: 139 },
};

// Kader is folie op de bovenplaat, dus elke kleur kan.
export const KADERS = {
  wit: { label: 'Wit', kleur: '#ffffff' },
  zwart: { label: 'Zwart', kleur: '#231b33' },
  blush: { label: 'Blush', kleur: '#f6c9d8' },
  lila: { label: 'Lila', kleur: '#d9ccf7' },
  mint: { label: 'Mint', kleur: '#bfe8d5' },
  boter: { label: 'Boter', kleur: '#fbe7a1' },
  framboos: { label: 'Framboos', kleur: '#e23b7e' },
}

export const START = {
  naam: 'jouwsalon',
  ondertitel: 'Lashes · Brows · Nails',
  likes: 11100,
  reacties: 297,
  vorm: 'telefoon',
  formaat: 'm',
  led: 'uit',
  kader: 'wit',
  kaderKleur: '#ff7a00',
};

export const HEX = /^#[0-9a-f]{6}$/i;

export function kaderKleur(cfg) {
  if (cfg.kader === 'eigen' && HEX.test(cfg.kaderKleur ?? '')) return cfg.kaderKleur;
  return KADERS[cfg.kader]?.kleur ?? '#ffffff';
}

export function kaderNaam(cfg) {
  return cfg.kader === 'eigen' ? `Eigen kleur ${cfg.kaderKleur}` : KADERS[cfg.kader]?.label ?? 'Wit';
}

// Tekst en iconen op het kader: donker op lichte kleuren, wit op donkere.
export function opKader(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? '#0d0d14' : '#ffffff';
}

export function formaatVan(cfg) {
  const vorm = VORMEN[cfg.vorm];
  return vorm.formaten.find((f) => f.id === cfg.formaat) ?? vorm.formaten[1];
}

export function prijsVan(cfg) {
  return formaatVan(cfg).prijs + LED[cfg.led].prijs;
}

export function euro(n) {
  return `€ ${n.toLocaleString('nl-NL')}`;
}

// 11100 -> 11,1K, zoals een app het toont
export function kort(n) {
  const x = Number(n) || 0;
  const fmt = (v, s) => `${v.toFixed(1).replace('.0', '').replace('.', ',')}${s}`;
  if (x >= 1e6) return fmt(x / 1e6, 'M');
  if (x >= 1e4) return fmt(x / 1e3, 'K');
  return x.toLocaleString('nl-NL');
}
