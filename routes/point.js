

'use strict';
var express = require('express');
var PointController = require('../controllers/pointCntrl');
var api = express.Router();
var userMiddleware = require('../middlewares/authenticated');

api.get('/get-point-user', userMiddleware.ensureAuth, PointController.getPointUser);
api.post('/save-point', userMiddleware.ensureAuth, PointController.savePoint);

module.exports = api;