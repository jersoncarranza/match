'use strict';
var Point = require('../models/point');
var moment = require('moment');

function savePoint(req, res){

    var point       = new Point();
    var pointParams = req.body;

    point.estado        = pointParams.estado;
    point.created_at    = moment().unix();
    point.description   = pointParams.description;
    point.puntos        = pointParams.puntos;
    point.user          = pointParams.user;

    point.save((err, pointStored) =>{
        if(err) return res.status(500).send({message:'Error en la peticion del point '+err, status:0 });
        if(!pointStored) return res.status(500).send({message:'Error al point'+ err,        status:0 });
        
        return res.status(200).send({
            point:pointStored,
            status:1,
            message:'ok'
        });
    });  

    };


function getPointUser(){
    var identity_user_id = req.user.sub;
    var query = {_id: identity_user_id };
        Point.findOne(query).sort('-created_at').exec((err, pointResult) =>{
                if(err) return res.status(200).send({message:'Error en la peticion', status:0});
                return res.status(200).send({
                    pointResult:pointResult,
                    status:1,
                    message:'ok'
                });
            });
}

module.exports ={
    savePoint,
    getPointUser
}