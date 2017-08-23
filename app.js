var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongoose');
var app = express();


var balada = require('./models/banco')();
mongo.connect("mongodb://localhost:27017/test");

// Callback function
var mycallback = function(err,results) {
    console.log("mycallback");
    if(err) throw err;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/mountain-king-html')));

var routes = require('./routes/routes.js')(app);

app.listen(1337);
