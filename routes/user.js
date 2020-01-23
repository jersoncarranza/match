'use strict';
var express = require('express');
var api = express.Router();
var userController = require('../controllers/userCntrl');
var userMiddleware = require('../middlewares/authenticated');


api.get('/pruebas', function pruebas(req, res){
    res.status(200).send({
    message:'pruebas en el servidor'
    })
});

api.post('/save-user', userController.saveUser);
api.post('/login', userController.loginUser);
api.post('/edit-preferencia-sexo',userMiddleware.ensureAuth, userController.editPreferenciaSexo);

api.put('/edit-user', userMiddleware.ensureAuth, userController.updateUser);





module.exports = api;