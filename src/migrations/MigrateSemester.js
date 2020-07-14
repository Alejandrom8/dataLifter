const DataBase = require('../DataBase'),
	  config = require('../../config');

class MigrateSemester{
	constructor(semester){
		this.semester = semester;
	}

	async uploadDataBase(){
		let client, result = {success: false};

		try{
			client = await DataBase.getClient();
			let db = client.db(config.database.mongodb.db);
			let collection = db.collection('semester');
			let insert = await collection.insertOne(this.semester);
			if(!insert.result.ok) throw "No se ha logrado registrar el semestre";
			result.data = insert;
			result.success = true;
		}catch(err){
			console.log(err);
			result.errors = err;
		}finally{
			client.close();
			return result;
		}
	}
}

module.exports = MigrateSemester;
