'use strict';
var http	    = require('http');
var app = require('./app')
var server = http.createServer(app);
var PORT        =  process.env.PORT || 4000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
var mongoose    = require('mongoose');
mongoose.Promise = global.Promise;

const uri = 'mongodb://localhost:27017/match';

mongoose.connect(uri, {useNewUrlParser: true,  useUnifiedTopology:true})
.then(() =>{
    
        server.listen(PORT , server_host, function () {console.log(`Listening on ${ PORT }`) }
        );
})
.catch(err => console.log(err));

