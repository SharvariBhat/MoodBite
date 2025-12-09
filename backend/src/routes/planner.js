const express = require('express');
const { generateWeeklyPlan, getMealPlans } = require('../controllers/plannerController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/week', authMiddleware, generateWeeklyPlan);
router.get('/', authMiddleware, getMealPlans);

module.exports = router;
