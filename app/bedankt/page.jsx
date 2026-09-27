'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const TEKST = {
  paid: ['Betaald. Dank je wel!', 'Je proef komt binnen één werkdag in je mail. Keur je hem goed, dan gaan we maken.'],
  open: ['Je betaling is nog niet rond.', 'Rond je betaling af, dan gaan we voor je aan de slag.'],
  pending: ['Je betaling wordt verwerkt.', 'Dit duurt meestal een paar seconden. Deze pagina ververst vanzelf.'],
  canceled: ['Je hebt de betaling geannuleerd.', 'Je ontwerp staat nog klaar. Probeer het opnieuw wanneer je wilt.'],
  expired: ['Je betaling is verlopen.', 'Je ontwerp staat nog klaar. Bestel opnieuw om te betalen.'],
  failed: ['Je betaling is mislukt.', 'Er is niets afgeschreven. Probeer het opnieuw of kies een andere betaalmethode.'],
};

export default function Bedankt() {
  const [staat, setStaat] = useState({ status: 'laden' });

  useEffect(() => {
    let id = null;
    try { id = sessionStorage.getItem('smsp-betaling'); } catch {}
    if (!id) return setStaat({ status: 'geen' });
    let t;
    const haal = async () => {
      const res = await fetch(`/api/betaling?id=${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setStaat({ status: 'fout', melding: data.fout });
      setStaat(data);
      if (data.status === 'pending' || data.status === 'open') t = setTimeout(haal, 3000);
    };
    haal();
    return () => clearTimeout(t);
  }, []);

  const [kop, tekst] = TEKST[staat.status] ?? (
    staat.status === 'laden' ? ['Even kijken...', 'We halen je betaalstatus op.']
      : staat.status === 'geen' ? ['Geen bestelling gevonden.', 'Ontwerp je spiegel en bestel hem, dan zie je hier je betaling.']
        : ['Status onbekend.', staat.melding || 'Probeer de pagina te verversen.']
  );
  const opnieuw = ['canceled', 'expired', 'failed', 'geen'].includes(staat.status);
  let checkout = null;
  if (staat.status === 'open') { try { checkout = sessionStorage.getItem('smsp-checkout'); } catch {} }

  return (
    <section className="bedankt-pagina">
      <span className="sticker" style={{ '--draai': '-3deg' }}>{staat.status === 'paid' ? 'Besteld' : 'Je bestelling'}</span>
      <h1>{kop}</h1>
      <p>{tekst}</p>
      {staat.omschrijving && <p className="bedankt-pagina__wat">{staat.omschrijving} · € {staat.bedrag?.replace('.', ',')}</p>}
      {checkout
        ? <a className="knop knop--roze knop--groot" href={checkout}>Rond je betaling af</a>
        : <Link className="knop knop--roze knop--groot" href={opnieuw ? '/ontwerpen' : '/'}>{opnieuw ? 'Naar je ontwerp' : 'Naar de homepage'}</Link>}
    </section>
  );
}
