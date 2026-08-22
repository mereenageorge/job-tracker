import { useState } from 'react';

const EMPTY_FORM = { company: '', role: '', status: 'APPLIED', dateApplied: '', jobUrl: '', notes: '' };

export default function ApplicationForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isOpen, setIsOpen] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(form);
    setForm(EMPTY_FORM);
    setIsOpen(false);
  }

  if (!isOpen) {
    return <button className="btn-primary" onClick={() => setIsOpen(true)}>+ Add application</button>;
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="application-form__row">
        <input placeholder="Company" value={form.company} onChange={(e) => update('company', e.target.value)} required />
        <input placeholder="Role" value={form.role} onChange={(e) => update('role', e.target.value)} required />
      </div>
      <div className="application-form__row">
        <input type="date" value={form.dateApplied} onChange={(e) => update('dateApplied', e.target.value)} required />
        <select value={form.status} onChange={(e) => update('status', e.target.value)}>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <input placeholder="Job posting URL (optional)" value={form.jobUrl} onChange={(e) => update('jobUrl', e.target.value)} />
      <textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
      <div className="application-form__actions">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" className="btn-ghost" onClick={() => setIsOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
