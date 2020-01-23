'use strict';

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema ({
    _id:        String,
    nombres:    String,
    apellidos:  String,
    nickname:   String,
    password:   String,
    estadoCivil:String,
    fechaNacimiento: String,
    image:      String,
    email:      String,
    codigo:     String,
    estado:     Number, //0 Inabilitado ; 1 Habilitado
    enabled:    Boolean, // True: Activo: False Desactivado
    sexo:       Number,
    sexoPreferencia:Number, //  0 Mujer(Woman); 1 Hombre (Man Male)
    independiente: Number,
    tatto:         Number,
    hijos:         Number,
    descripcion:   String,
    facebook:      String,
    twitter:       String,
    created:    String
});

module.exports = mongoose.model('User', UserSchema);
