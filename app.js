var express = require('express'), app = express();
var bodyParser = require('body-parser');
var mongo = require('mongoose');

mongo.connect("mongodb://localhost:27017/test");

var Balada = mongo.model('Baladas', {nome:String,Endereco:String,long:String,lat:String})

// Callback function
var mycallback = function(err,results) {
    console.log("mycallback");
    if(err) throw err;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
	Balada.find(function(err, result){
       res.send(result);
    });
});

app.post('/balada', function(req, res){
	if(req.body.nome){
		Balada.find({ nome: req.body.nome}, function(err, result){
			res.send(result);
		});
	}
});

app.post('/',function(req,res){
  var novo = new Balada(req.body);
	novo.save(function(err){
		if(err) throw err;
		res.send("Dados Salvos com sucesso!")
	});
});
app.listen(1337);
