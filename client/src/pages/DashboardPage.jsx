import { useEffect, useState, useCallback } from 'react';
import { applicationsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatsBar from '../components/StatsBar';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationTable from '../components/ApplicationTable';

const FILTERS = ['ALL', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const status = filter === 'ALL' ? undefined : filter;
      const [apps, statsData] = await Promise.all([
        applicationsApi.list(auth.token, status),
        applicationsApi.stats(auth.token),
      ]);
      setApplications(apps);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    }
  }, [auth.token, filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(form) {
    await applicationsApi.create(auth.token, form);
    await loadData();
  }

  async function handleStatusChange(id, status) {
    await applicationsApi.update(auth.token, id, { status });
    await loadData();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this application?')) return;
    await applicationsApi.remove(auth.token, id);
    await loadData();
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Job Tracker</h1>
        <div>
          <span className="dashboard__user">{auth.user.email}</span>
          <button className="btn-ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      {error && <p className="form-error">{error}</p>}

      <StatsBar stats={stats} />

      <div className="dashboard__toolbar">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <ApplicationForm onSubmit={handleCreate} />
      </div>

      <ApplicationTable
        applications={applications}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
