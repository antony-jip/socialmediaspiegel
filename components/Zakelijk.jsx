'use client';

import { useState } from 'react';

export default function ZakelijkFormulier() {
  const [soort, setSoort] = useState('meer');
  const [staat, setStaat] = useState({ fase: 'leeg', melding: '' });

  const verstuur = async (e) => {
    e.preventDefault();
    const velden = Object.fromEntries(new FormData(e.currentTarget));
    setStaat({ fase: 'bezig', melding: '' });
    try {
      const res = await fetch('/api/zakelijk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...velden, soort }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.fout || 'Versturen lukte niet.');
      setStaat({ fase: 'klaar', melding: velden.email });
    } catch (err) {
      setStaat({ fase: 'fout', melding: err.message });
    }
  };

  if (staat.fase === 'klaar') {
    return (
      <div className="bedankt" role="status">
        <h3>Aanvraag verstuurd.</h3>
        <p>We nemen binnen één werkdag contact met je op via {staat.melding}.</p>
      </div>
    );
  }

  return (
    <form className="formulier" onSubmit={verstuur}>
      <fieldset className="keuze veld--breed">
        <legend>Waar gaat het om?</legend>
        <div className="keuze__rij">
          {[['meer', 'Meerdere spiegels'], ['huur', 'Huren voor een evenement']].map(([id, label]) => (
            <label key={id} className={soort === id ? 'is-aan' : ''}>
              <input type="radio" name="soort-keuze" checked={soort === id} onChange={() => setSoort(id)} />{label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="veld"><span>Je naam</span><input name="naam" required autoComplete="name" /></label>
      <label className="veld"><span>Bedrijf</span><input name="bedrijf" autoComplete="organization" /></label>
      <label className="veld"><span>E-mail</span><input name="email" type="email" required autoComplete="email" /></label>
      <label className="veld"><span>Telefoon</span><input name="telefoon" type="tel" autoComplete="tel" /></label>
      {soort === 'meer' ? (
        <label className="veld veld--breed"><span>Hoeveel spiegels, en voor hoeveel vestigingen?</span><input name="aantal" placeholder="Bijvoorbeeld 12 spiegels voor 6 vestigingen" /></label>
      ) : (
        <>
          <p className="melding veld--breed">
            <b>Ophalen en terugbrengen in Enkhuizen.</b> Je haalt de spiegel zelf bij ons op en brengt hem na je evenement weer terug. Vervoer regel je zelf; neem een auto mee waar een spiegel van 60 × 120 cm plat in past.
          </p>
          <label className="veld"><span>Datum</span><input name="datum" type="date" /></label>
          <label className="veld"><span>Plaats</span><input name="plaats" placeholder="Waar is het evenement?" /></label>
        </>
      )}
      <label className="veld veld--breed"><span>Vertel kort wat je zoekt</span><textarea name="bericht" rows={4} placeholder={soort === 'meer' ? 'Welke maten, huisstijl, gewenste levering?' : 'Wat voor evenement, hoeveel gasten, binnen of buiten?'} /></label>
      {staat.fase === 'fout' && <p className="fout veld--breed" role="alert">{staat.melding}</p>}
      <button className="knop knop--framboos knop--groot veld--breed" disabled={staat.fase === 'bezig'}>
        {staat.fase === 'bezig' ? 'Aanvraag versturen...' : 'Verstuur je aanvraag'}
      </button>
    </form>
  );
}
