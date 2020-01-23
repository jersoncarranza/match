'use strict';
var express = require('express');
var api = express.Router();
var userController = require('../controllers/userCntrl');
var userMiddleware = require('../middlewares/authenticated');


var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});


api.get('/pruebas', function pruebas(req, res){
    res.status(200).send({
    message:'pruebas en el servidor'
    })
});

api.post('/save-user', userController.saveUser);
api.post('/login', userController.loginUser);
api.post('/edit-preferencia-sexo',userMiddleware.ensureAuth, userController.editPreferenciaSexo);

api.put('/edit-user', userMiddleware.ensureAuth, userController.updateUser);
api.post('/upload-user-cloudinary/:id', [md_auth.ensureAuth,md_upload],UserController.uploadCloudinary);





module.exports = api;