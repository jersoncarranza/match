'use strict';
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var jwt  = require('../services/jwt');
var conf    = require('../conf.json');


function saveUser(req, res){

    var params = req.body;
    var userSave = new User();
    if(params.nombres && params.email && params.password){
        userSave.nombres         = params.nombres;
        userSave.apellidos       = params.apellidos;
        userSave.sexo            = params.sexo;
        //userSave.sexoPreferencia = params.sexoPreferencia;
        userSave.sexoPreferencia = params.sexo == 1 ? 0 :  1;  
        userSave.fechaNacimiento = params.fechaNacimiento;
        userSave.email           = params.email;
        userSave.created         = moment().unix();
        userSave.estado         = 1;
        userSave.enabled        = true;


        FindEmail(userSave.email).then((value)=>{
            if(value.count == 0 ) {
                
                bcrypt.hash(params.password, null, null, (err, hash)=> {
                    userSave.password = hash;
               
                    saveUserMatch(userSave).then((value) => {
                        return res.status(200).send({
                            user: value.data,
                            status: value.status
                        });
                    }); 
                });

            }else{
                return res.status(200).send({ message: 'Este correo ya esta registrado', status: 9 });
            }

        });
    }

}

    async function FindEmail(email) {
    var query = {'email':email};
    var data ;
    var findEntity = await User.findOne(query)
    .exec()
    .then((resultEntity) => { 
        if(resultEntity){
            data = {
                data:resultEntity,
                count:1
            }
        }else{
            data = {
                data:resultEntity,
                count:0
            } 
        }
        return Promise.resolve(data);
    })
    .catch((err) => { return handleError(err);    });
    return Promise.resolve(findEntity);
    }

    async function saveUserMatch(User) {
        let saveUser =await User
            .save()
            .then(savedObj => {
                if (savedObj) { savedObj.someProperty = null;
                    var data ={
                        data : savedObj,
                        status:1
                    };
                    return Promise.resolve(data);
                } else {    var data ={
                            data : error,
                            status:0
                }
                return Promise.reject(data);
                }
        });
        return Promise.resolve(saveUser);
    }


    function loginUser(req, res){
        var params = req.body;

        var email = params.email;
        var password = params.password;
        User.findOne({email:email}, (err, user)=>{
            if(err) return res.status(500).send({message:'Error en la peticion', status:0});
            if(user){
                //////
                bcrypt.compare(password, user.password, (err,check)=>{
                    if(check){
                    
                        if (user.estado == 1) { //Chequear si esta activado el usuario 1 activado; 
                          //  if(params.gettoken){
                                user.password = undefined;
                                return res.status(200).send({
                                    token :  jwt.createToken(user),
                                    user:user,
                                    status:1,
                                    message:'ok'
                                });
                           // }else{
                                //devolver datos de usuario
                           //     user.password = undefined;
                           //     return res.status(200).send({user,status:1,message:'ok', message:'Sin token'});
                           // }
                        }else{return res.status(200).send({message:'El usuario esta desactivado', status:0}) }
    
                    }else{ 
                        return res.status(200).send({message:'El usuario no ha podido con la clave', status:2})
                
                    }
                });
                /////////
            }else{
                return res.status(200).send({message:'Este correo no existe', status:8,message:'ok'})
            }
        });
    }

    function editPreferenciaSexo(req, res){

        var params = req.body;
        if (params.id == null) {
            return res.status(200).send({message:'Falta el id', status:0});
        }
        
        var EditUser = new User();
        EditUser.sexoPreferencia =  params.sexoPreferencia != null ? params.sexoPreferencia :  -1;
        if (EditUser.sexoPreferencia == -1) {  EditUser.sexoPreferencia = req.user.sub == 1 ? 0 :  1;  }

        var condition = {_id:params.id};
        var query     = { $set: { sexoPreferencia: EditUser.sexoPreferencia } };

        User.updateOne(condition, query, (err, userUpdated) =>{
            if(err) return res.status(200).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
            if(!userUpdated) return res.status(200).send({message:'No se ha podido actualizar el usuario', status:0});        
            return res.status(200).send({user:userUpdated, status:1});
        });
    }
        
    // Edicion de datos de usuario
    function updateUser(req, res){
    var userId= req.params.id;
    var update= req.body;
    // borrar propiedad password
    delete update.password;
    delete update.email;

    if(userId != req.user.sub){  return res.status(300).send({message:'no tienes permiso'})};
        User.findOneAndUpdate({_id:userId}, update,{new:true}, (err, userUpdated) =>{
            if(err) return res.status(505).send({message:'No tienes permiso para actualizar los datos del usuario'});
            if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
            return res.status(200).send({user:userUpdated});
        }); 
    }


    /**Cloudinay**/
function uploadCloudinary (req, res){
    var userId = req.params.id;
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    cloudinary.config({ 
        cloud_name: conf.cloudinary.name ,  
        api_key: conf.cloudinary.key, 
        api_secret: conf.cloudinary.secret,
        uploadOptions: {
            folder: 'fotos'
        }
    });
 
    cloudinary.uploader.upload(file_path,  function(result) { 
            if(result != null){
            
            var format = result.format;
            var namepublic = result.public_id;
            var urlimage = namepublic + "."+format;
            var version = result.version;//.toString();
            urlimage = "v"+version+"/"+urlimage;
            
            User.findByIdAndUpdate(userId,
                {image:urlimage},
                {new: true},
                (err, userUpdated) =>{
                    if(err) return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario'})
                    if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
                    return res.status(200).send({user:userUpdated});        
                })
            }else{
                return res.status(200).send({user:'error',status:0}); 
            }
                
        });

    }


    module.exports = {
        saveUser,
        loginUser,
        editPreferenciaSexo,
        updateUser,
        uploadCloudinary
    }