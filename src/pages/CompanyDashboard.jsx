import { useEffect, useState } from 'react';
import { api } from '../api'; // path badal lo agar api.js kahin aur hai

const C = {
  bg: '#141414', card: '#1c1c1c', border: '#2a2a2a',
  text: '#f5f5f5', muted: '#9a9a9a', accent: '#e63946', pink: '#ff8fa3',
};

// sabse bada value jis jis ka hai (tie ho to dono dikhte hain)
function topNames(list, valueKey, nameKey) {
  if (!list || !list.length) return '—';
  const max = Math.max(...list.map((x) => x[valueKey]));
  return list.filter((x) => x[valueKey] === max).map((x) => x[nameKey]).join(' / ');
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.muted }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.pink, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function BarChart({ title, data, nameKey, valueKey, unit }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]));
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <h3 style={{ margin: '0 0 16px', color: C.text, fontSize: 16 }}>{title}</h3>
      {data.length === 0 && <p style={{ color: C.muted }}>No data yet</p>}
      {data.map((d) => (
        <div key={d[nameKey]} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.text, marginBottom: 4 }}>
            <span>{d[nameKey]}</span>
            <span style={{ color: C.muted }}>{d[valueKey].toLocaleString('en-IN')} {unit}</span>
          </div>
          <div style={{ background: C.border, borderRadius: 6, height: 8 }}>
            <div style={{ width: `${(d[valueKey] / max) * 100}%`, background: C.accent, height: 8, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CompanyDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/insights').then(setData).catch((e) => setError(e.message));
  }, []);

  const page = { background: C.bg, minHeight: '100vh', padding: 32, color: C.text };

  if (error) return <div style={page}><p style={{ color: C.accent }}>{error}</p></div>;
  if (!data) return <div style={page}><p style={{ color: C.muted }}>Loading…</p></div>;

  const grid = { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' };

  return (
    <div style={page}>
      <h1 style={{ marginTop: 0 }}>Brand insights<span style={{ color: C.accent }}>.</span></h1>

      <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 16 }}>
        <StatCard label="Top genre (views)" value={topNames(data.viewsByGenre, 'views', 'genre')} />
        <StatCard label="Top genre (favourites)" value={topNames(data.favouritesByGenre, 'favourites', 'genre')} />
        <StatCard label="Top category (wishlist)" value={topNames(data.wishlistByCategory, 'count', 'category')} />
        <StatCard label="Top fandom (wishlist)" value={topNames(data.wishlistByFandom, 'count', 'fandom')} />
        <StatCard label="Top category (cart)" value={topNames(data.cartByCategory, 'quantity', 'category')} />
      </div>

      <div style={grid}>
        <BarChart title="Views by genre" data={data.viewsByGenre} nameKey="genre" valueKey="views" unit="views" />
        <BarChart title="Favourites by genre" data={data.favouritesByGenre} nameKey="genre" valueKey="favourites" unit="favs" />
        <BarChart title="Wishlist by category" data={data.wishlistByCategory} nameKey="category" valueKey="count" unit="wishlists" />
        <BarChart title="Wishlist by fandom" data={data.wishlistByFandom} nameKey="fandom" valueKey="count" unit="wishlists" />
        <BarChart title="Cart quantity by category" data={data.cartByCategory} nameKey="category" valueKey="quantity" unit="in carts" />
      </div>
    </div>
  );
}