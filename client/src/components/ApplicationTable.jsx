const STATUS_OPTIONS = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

export default function ApplicationTable({ applications, onStatusChange, onDelete }) {
  if (applications.length === 0) {
    return <p className="empty-state">No applications yet — add your first one above.</p>;
  }

  return (
    <table className="application-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Applied</th>
          <th>Status</th>
          <th>Link</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app.id}>
            <td>{app.company}</td>
            <td>{app.role}</td>
            <td>{new Date(app.date_applied).toLocaleDateString()}</td>
            <td>
              <select
                className={`status-select status-select--${app.status.toLowerCase()}`}
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </td>
            <td>
              {app.job_url ? (
                <a href={app.job_url} target="_blank" rel="noopener noreferrer">View ↗</a>
              ) : (
                '—'
              )}
            </td>
            <td>
              <button className="btn-danger-text" onClick={() => onDelete(app.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
