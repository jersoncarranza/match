'use strict';
var express = require('express');
var MatchController = require('../controllers/matchCntrl');
var api = express.Router();
var userMiddleware = require('../middlewares/authenticated');
api.get('/get-match', userMiddleware.ensureAuth, MatchController.getMatch);
api.post('/save-match', userMiddleware.ensureAuth, MatchController.saveMatch);

module.exports = api;