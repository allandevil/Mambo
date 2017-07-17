var mongo = require('mongoose');
var Balada = mongo.model('Baladas');

module.exports = {
	listEnd: function(req, res, next){
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
	},
	gravar: function(req,res){
		var request = req.body;

		console.log(request.length);

		if(request.length >= 2){
			for (var i = 0; i < request.length; i++) {
				var balada = new Balada(request[i]);
				balada.save(function(err){
					if (err) {
		 				return res.json(500, err);
		 		 }
				});
			}
		}else if(request != undefined){
			var balada = new Balada(request);
			balada.save(function(err){
				if (err) {
					return res.json(500, err);
			 }
			});
		}
		res.send("Dados Salvos com sucesso!");

	},
	buscarID: function(req, res){
		if(req.body._id){
			Balada.findById(req.body._id, function(err, result){
				if (err) {
					return res.json(500, err);
				}
				res.send(result);
			});
		}else {
			return res.json(420, "deu ruim");
		}
	},
	deleteID: function(req,res){
		if(req.body._id){
			Balada.findByIdAndRemove(req.body._id, function(err) {
				if (err) {
					return res.json(500, err);
				}
				console.log('User deleted!');
				res.send('Balada deleted!');
			});
		}else {
			return res.json(420, "deu ruim");
		}
	},
	buscar: function(req, res){
		if(req.body.nome){
			Balada.find({ nome: req.body.nome}, function(err, result){
				if (err) {
					return res.json(500, err);
				}
				res.send(result);
			});
		}else {
			return res.json(420, "deu ruim");
		}
	},
	listarBaladas: function(req, res){
		Balada.find(function(err, result){
					if (err) {
						return res.json(500, err);
					}
	       res.send(result);
	    });
	}
};
