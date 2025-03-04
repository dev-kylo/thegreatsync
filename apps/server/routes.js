const express = require('express');
const gitRoutes = require('./git.routes');
const teamRoutes = require('./team.routes');

const router = express.Router();

router.use('/git', gitRoutes);
router.use('/team', teamRoutes);
