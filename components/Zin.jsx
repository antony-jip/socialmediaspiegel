// Vette koppen hebben krappe letterafstand; een losse punt of vraagteken schuift daardoor weg.
// Zin zet het leesteken aan het eind in een span die weer aansluit.
export default function Zin({ children }) {
  if (typeof children !== 'string') return children;
  const m = children.match(/^(.*?)([.?!])$/s);
  if (!m) return children;
  return <>{m[1]}<span className="punt">{m[2]}</span></>;
}
