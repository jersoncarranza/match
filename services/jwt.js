'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_match';

exports.createToken = function(user){


    var payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        nickname: user.nickname,
        password: user.password,
        estadoCivil: user.estadoCivil,
        fechaNacimiento: user.fechaNacimiento,
        image: user.image,
        email   :   user.email,
        estado  :   user.estado,
        sexo    :   user.sexo,
        sexoPreferencia:    user.sexoPreferencia,
        independiente   :   user.independiente,
        iat:moment().endOf('day').fromNow(),
        //exp:moment().endOf('day').fromNow()
        //iat: moment().unix(),
        exp: moment(moment()).add(1, 'days').unix

     
    };

    return jwt.encode(payload, secret);
}
