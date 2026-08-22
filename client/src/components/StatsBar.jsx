const LABELS = { APPLIED: 'Applied', INTERVIEW: 'Interview', OFFER: 'Offer', REJECTED: 'Rejected' };

export default function StatsBar({ stats }) {
  if (!stats) return null;
  return (
    <div className="stats-bar">
      {Object.entries(LABELS).map(([key, label]) => (
        <div className={`stat-pill stat-pill--${key.toLowerCase()}`} key={key}>
          <span className="stat-pill__count">{stats[key] ?? 0}</span>
          <span className="stat-pill__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
