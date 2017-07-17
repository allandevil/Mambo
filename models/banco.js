var mongo = require('mongoose');
var Schema = mongo.Schema;

var BaladaModel = function() {
	var Balada = new Schema({
		nome:String,
		Endereco:String,
		Local: {
			 type: [Number],   // [ <longitude> , <latitude> ]
			 index: '2d'       // geospatial index
		}
	});
	mongo.model('Baladas',Balada);
};

module.exports = BaladaModel;
