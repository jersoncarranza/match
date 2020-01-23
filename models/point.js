'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PointSchema = ({
    estado:         Number,
    created_at:     String,
    description:    Number,
    puntos:         Number,
    user: {type: Schema.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Point', PointSchema);