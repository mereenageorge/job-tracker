const pool = require('../config/db');

const VALID_STATUSES = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

async function listApplications(req, res) {
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM applications WHERE user_id = $1';
    const params = [req.user.id];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    query += ' ORDER BY date_applied DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

async function getStats(req, res) {
  try {
    const result = await pool.query(
      'SELECT status, COUNT(*) AS count FROM applications WHERE user_id = $1 GROUP BY status',
      [req.user.id]
    );
    const stats = { APPLIED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0 };
    result.rows.forEach((row) => {
      stats[row.status] = parseInt(row.count, 10);
    });
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

async function createApplication(req, res) {
  const { company, role, status, dateApplied, jobUrl, notes } = req.body;

  if (!company || !role || !dateApplied) {
    return res.status(400).json({ error: 'company, role, and dateApplied are required' });
  }
  const finalStatus = status || 'APPLIED';
  if (!VALID_STATUSES.includes(finalStatus)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO applications (user_id, company, role, status, date_applied, job_url, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, company, role, finalStatus, dateApplied, jobUrl || null, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create application' });
  }
}

async function updateApplication(req, res) {
  const { id } = req.params;
  const { company, role, status, dateApplied, jobUrl, notes } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    // The "AND user_id = $X" clause is what stops one user from editing
    // another user's application, even if they guessed a valid id.
    const result = await pool.query(
      `UPDATE applications
       SET company = COALESCE($1, company),
           role = COALESCE($2, role),
           status = COALESCE($3, status),
           date_applied = COALESCE($4, date_applied),
           job_url = COALESCE($5, job_url),
           notes = COALESCE($6, notes)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [company, role, status, dateApplied, jobUrl, notes, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
}

async function deleteApplication(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
}

module.exports = { listApplications, getStats, createApplication, updateApplication, deleteApplication };
