const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

app.use(cors()); // allows the React frontend (a different origin in dev) to call this API
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Catches errors thrown synchronously in route handlers that weren't
// already caught locally, so the server returns a clean 500 instead
// of crashing or hanging.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Job tracker API listening on port ${PORT}`));

module.exports = app;
