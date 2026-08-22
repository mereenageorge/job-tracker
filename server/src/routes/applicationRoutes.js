const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listApplications,
  getStats,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

const router = express.Router();

// Every route below requires a valid JWT — applied once here rather
// than repeated in each controller function.
router.use(requireAuth);

router.get('/', listApplications);
router.get('/stats', getStats);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
