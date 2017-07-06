var express = require('express'), app = express();
var bodyParser = require('body-parser');
var mongo = require('mongoose');

mongo.connect("mongodb://localhost:27017/test");

var Balada = mongo.model('Baladas',
{
	nome:String,
	Endereco:String,
	Local: {
		 type: [Number],   // [ <longitude> , <latitude> ]
		 index: '2d'       // geospatial index
	}
})

// Callback function
var mycallback = function(err,results) {
    console.log("mycallback");
    if(err) throw err;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//lIstar Baladas
app.get('/', function(req, res){
	Balada.find(function(err, result){
       res.send(result);
    });
});

//lIstar Baladas Proximas
app.post('/baladasLocal', function(req, res, next){
	var limit = req.body.limit || 0;
	// default 1 kilometer
	var maxDistance = req.body.distance || 1;

	var coords = [];
	coords[0] = req.body.longitude || 0;
	coords[1] = req.body.latitude || 0;

	console.log(coords);

	Balada.find({
		 Local: {
				$near: coords,
				$maxDistance: maxDistance
		 }
		//  Local: {
		// 	 $geoWithin:{
		// 		 $centerSphere:[
		// 			 coords,
		// 			 maxDistance
		// 		 ]
		// 	 }
		// }
	}).limit(limit).exec(function(err, locations) {
		 if (err) {
				return res.json(500, err);
		 }
		 console.log('Locais',locations)
		 res.status(200).json(locations);
	});
});

//buscar por nome
app.post('/balada', function(req, res){
	if(req.body.nome){
		Balada.find({ nome: req.body.nome}, function(err, result){
			res.send(result);
		});
	}
});

//Busca Por id
app.post('/id', function(req, res){
	if(req.body._id){
		Balada.findById(req.body._id, function(err, result){
			res.send(result);
		});
	}
});

//gravar registro
app.post('/',function(req,res){
  var novo = new Balada(req.body);
	novo.save(function(err){
		if(err) throw err;
		res.send("Dados Salvos com sucesso!")
	});
});
app.listen(1337);
