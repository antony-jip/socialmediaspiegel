// Prijsvoorstel: nog toetsen aan productiekosten.
export const VORMEN = {
  telefoon: {
    label: 'Telefoon',
    ratio: 0.5,
    formaten: [
      { id: 's', maat: '40 × 80 cm', prijs: 199 },
      { id: 'm', maat: '60 × 120 cm', prijs: 299 },
      { id: 'l', maat: '80 × 160 cm', prijs: 429 },
    ],
  },
  post: {
    label: 'Post',
    ratio: 0.8,
    formaten: [
      { id: 's', maat: '50 × 60 cm', prijs: 179 },
      { id: 'm', maat: '70 × 85 cm', prijs: 259 },
      { id: 'l', maat: '90 × 110 cm', prijs: 359 },
    ],
  },
};

export const LED = {
  uit: { label: 'Zonder', prijs: 0 },
  warm: { label: 'Warm', prijs: 79 },
  koel: { label: 'Koel', prijs: 79 },
};

export const KADERS = { licht: 'Wit', donker: 'Zwart' };

export const START = {
  naam: 'jouwsalon',
  ondertitel: 'Lashes · Brows · Nails',
  likes: 11100,
  reacties: 297,
  vorm: 'telefoon',
  formaat: 'm',
  led: 'warm',
  kader: 'licht',
};

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
