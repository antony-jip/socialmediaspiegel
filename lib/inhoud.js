export const NAV = [
  ['/ontwerpen', 'Ontwerpen'],
  ['/voorbeelden', 'Voorbeelden'],
  ['/ons-verhaal', 'Ons verhaal'],
  ['/vragen', 'Vragen'],
  ['/zakelijk', 'Zakelijk'],
];

export const WIE = ['Kappers', 'Nagelstudio’s', 'Barbers', 'Wimpers & brows', 'Tattooshops', 'Horeca', 'Sportscholen', 'Winkels'];

// Impressiebeelden (fal) met het ontwerp dat erbij hoort. Vervangen door echte foto's na het proefstuk.
export const VOORBEELDEN = [
  { id: 'salon', beeld: '/beeld/selfie.jpg', tag: 'Beautysalon', alt: 'Vrouw maakt een selfie voor De Story met wit kader en warme gloed', cfg: { vorm: 'telefoon', formaat: 'm', led: 'warm', kader: 'wit' } },
  { id: 'barber', beeld: '/beeld/barber.jpg', tag: 'Barber', alt: 'Man maakt een selfie voor De Story met zwart kader en warme gloed', cfg: { vorm: 'telefoon', formaat: 'm', led: 'warm', kader: 'zwart' } },
  { id: 'wimpers', beeld: '/beeld/wimpers.jpg', tag: 'Wimperstudio', alt: 'Vrouw bekijkt haar wimpers in De Story met lila kader en koele gloed', cfg: { vorm: 'telefoon', formaat: 'm', led: 'koel', kader: 'lila' } },
  { id: 'nagels', beeld: '/beeld/nagels.jpg', tag: 'Nagelstudio', alt: 'Vrouw toont haar nagels voor De Story met wit kader en koele gloed', cfg: { vorm: 'telefoon', formaat: 'm', led: 'koel', kader: 'wit' } },
  { id: 'cafe', beeld: '/beeld/cafe.jpg', tag: 'Koffiebar', alt: 'Twee vriendinnen maken een selfie voor De Story met boterkleurig kader', cfg: { vorm: 'telefoon', formaat: 'm', led: 'uit', kader: 'boter' } },
  { id: 'rgb', beeld: '/beeld/rgb.jpg', tag: 'Lunchroom', alt: 'Vrienden maken ’s avonds een selfie voor De Story met RGB-gloed', cfg: { vorm: 'telefoon', formaat: 'l', led: 'rgb', kader: 'wit' } },
  { id: 'kapper', beeld: '/beeld/kapper.jpg', tag: 'Kapsalon', alt: 'Klant bewondert haar föhnbeurt in De Story met blush kader en warme gloed', cfg: { vorm: 'telefoon', formaat: 'l', led: 'warm', kader: 'blush' } },
];

export const RUIMTES = [
  { id: 'salon', label: 'Beautysalon', foto: '/foto/salon.jpg', kleur: 'var(--blush)' },
  { id: 'kapper', label: 'Kapper', foto: '/foto/kapper.jpg', kleur: 'var(--mint)' },
  { id: 'nagels', label: 'Nagelstudio', foto: '/foto/nagels.jpg', kleur: 'var(--lila)' },
  { id: 'wimpers', label: 'Wimpers', foto: '/foto/wimpers.jpg', kleur: 'var(--hemel)' },
  { id: 'horeca', label: 'Koffiebar', foto: '/foto/horeca.jpg', kleur: 'var(--boter)' },
];

export const STAPPEN = [
  ['Ontwerp hem online', 'Naam, logo, kleur en licht. Je ziet meteen hoe hij wordt.'],
  ['Bestel en keur je proef', 'Je betaalt direct via Mollie. Binnen één werkdag krijg je een digitale proef, en pas na jouw akkoord maken we hem.'],
  ['Hang hem op', 'Binnen tien werkdagen bij je bezorgd, met boormal en ophangset.'],
];

export const VRAGEN = [
  ['Is het een echte spiegel?', 'Ja. Geen spiegelfolie of plexi, maar echt spiegelglas van 4 mm. Scherp, krasvast en makkelijk schoon. Op de achterkant zit veiligheidsfolie: breekt hij ooit, dan blijven de scherven aan de folie plakken.'],
  ['Staat er een app-logo op?', 'Nee. Hij lijkt op een post, maar zonder logo’s van apps. Alleen jouw naam en jouw logo.'],
  ['Waarom de vorm van een telefoon?', 'Omdat je klant zichzelf dan meteen ziet zoals in een post: jouw naam bovenin, likes eronder. Staand en slank past hij naast een behandelplek, bij de kassa of in een gang.'],
  ['Moet hij verlicht zijn?', 'Nee, standaard is hij onverlicht. Kies je Glow, dan krijg je warm wit, koel wit of RGB. Bij Glow RGB kies je zelf de kleur met een afstandsbediening.'],
  ['Kan het kader in mijn huiskleur?', 'Ja. Het kader is bedrukte folie, dus elke kleur kan. Kies hem bij het ontwerpen onder Eigen kleur.'],

  ['Kan het ook op maat?', 'Ja. Zet je maat in de opmerking bij je bestelling, dan krijg je een prijs bij je proef.'],
  ['Hoe hang ik hem op?', 'In drie stappen. De rail zit al op de spiegel: jij schroeft de muurrail vast met twee schroeven en hangt hem erop. Alles zit in de doos. Liever niet boren? Kies plak-klaar: de tape zit er al op, folie eraf en tegen de muur drukken. Het stappenplan staat hieronder.'],
  ['Hoe betaal ik?', 'Direct bij je bestelling, veilig via Mollie. Daarna krijg je binnen één werkdag je digitale proef.'],
  ['Hoe lang duurt het?', 'Je proef komt binnen één werkdag. Na je akkoord is hij binnen tien werkdagen bij je.'],
  ['Kan ik meerdere spiegels bestellen of er een huren?', 'Ja. Voor meerdere vestigingen maken we een prijs op maat, en voor evenementen kun je er een huren. Kijk op de pagina Zakelijk.'],
  ['Waar wordt hij gemaakt?', 'In onze eigen werkplaats bij Sign Company. Glas, folie en licht onder één dak.'],
];

export const MAKEN = [
  ['Echt spiegelglas', 'Spiegelglas van 4 mm met veiligheidsfolie. Scherp beeld, krasvast en makkelijk schoon te maken.'],
  ['Kader in jouw kleur', 'Twee lagen Dibond. De bovenste is bekleed met bedrukte, gelamineerde folie: jouw naam, jouw logo, jouw kleur.'],
  ['Glas vlak in het kader', 'De spiegel ligt in een uitsparing, precies gelijk met het kader. Rondom zit een zwarte rubberen rand, net als een hoesje om een telefoon.'],
  ['Licht als je wilt', 'Kies je Glow, dan zit er een LED-strip rondom op de achterkant. Op de afstandhouders valt de gloed op je muur: warm, koel of RGB.'],
];
