'use client';

import { useState } from 'react';
import { kaderKleur, kort, opKader, VORMEN } from '@/lib/spiegel';

const Hart = ({ vol }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.7 1.1 4.8 2.8 1.1-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z"
      fill={vol ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);
const Reactie = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.4-4.5a8.4 8.4 0 1 1 15.6-4.4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const Deel = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 3 10 14M21 3l-6.8 18-4.2-7-7-4.2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const Bewaar = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 3.5h12v17l-6-4.3-6 4.3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const Tab = ({ d }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TABS = [
  'M3.5 10.5 12 4l8.5 6.5V20h-5.5v-6h-6v6H3.5z',
  'M10.5 17.5a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM15.5 15.5l5 5',
  'M4 4h16v16H4zM12 8v8M8 12h8',
  'M4 5h16v14H4zM10 9l5 3-5 3z',
];

export default function Spiegel({ cfg, logo, video, interactief = false }) {
  const [extra, setExtra] = useState(0);
  const [pop, setPop] = useState(0);
  const likes = Number(cfg.likes || 0) + extra;
  const telefoon = cfg.vorm === 'telefoon';
  const initiaal = (cfg.naam || '?').replace('@', '').charAt(0).toUpperCase();
  const kader = kaderKleur(cfg);
  const accent = kader.toLowerCase() === '#ff2d87' ? '#ffffff' : '#ff2d87';

  const like = () => {
    setExtra((e) => (e ? 0 : 1));
    setPop((p) => p + 1);
  };

  return (
    <div
      className={`spiegel spiegel--${cfg.vorm} led--${cfg.led}`}
      style={{ aspectRatio: VORMEN[cfg.vorm].ratio, '--kader': kader, '--op': opKader(kader), '--accent': accent }}
    >
      <div className="spiegel__lijf">
        {telefoon && (
          <div className="spiegel__status" aria-hidden="true">
            <span>9:41</span>
            <span className="spiegel__eiland" />
            <span className="spiegel__batterij" />
          </div>
        )}
        <div className="spiegel__kop">
          <span className="spiegel__avatar">
            {logo ? <img src={logo} alt="" /> : <span>{initiaal}</span>}
          </span>
          <span className="spiegel__naam">
            <strong>{cfg.naam || 'jouwnaam'}</strong>
            {cfg.ondertitel && <small>{cfg.ondertitel}</small>}
          </span>
          <span className="spiegel__stip" aria-hidden="true">
            <i /><i /><i />
          </span>
        </div>

        <div className="spiegel__glas">
          {video}
          <span className="spiegel__glans" aria-hidden="true" />
        </div>

        <div className="spiegel__acties">
          {interactief ? (
            <button type="button" className={`spiegel__like${extra ? ' is-aan' : ''}`} onClick={like} aria-pressed={!!extra} aria-label="Like">
              <span key={pop} className="spiegel__hart"><Hart vol /></span>
            </button>
          ) : (
            <span className="spiegel__like is-aan"><span className="spiegel__hart"><Hart vol /></span></span>
          )}
          <span className="spiegel__getal">{kort(likes)}</span>
          <Reactie />
          <span className="spiegel__getal">{kort(cfg.reacties)}</span>
          <Deel />
          <span className="spiegel__rechts"><Bewaar /></span>
        </div>

        {telefoon && (
          <div className="spiegel__tabs" aria-hidden="true">
            {TABS.map((d) => <Tab key={d} d={d} />)}
            <span className="spiegel__mini">{logo ? <img src={logo} alt="" /> : initiaal}</span>
          </div>
        )}
      </div>
    </div>
  );
}
