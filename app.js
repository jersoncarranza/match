'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var user_routes = require('./routes/user');
var match_routes= require('./routes/match');
var point_routes = require('./routes/point');

// middlewares -- antes de llegar al controlador
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use('/user',user_routes);
app.use('/match', match_routes);
app.use('/point',  point_routes);

module.exports = app;