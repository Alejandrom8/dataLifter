const DataBase = require('../DataBase');
const MapSemester = require('../getData/MapSemester');
const config = require('../../config');


class MigrateSemester{
	constructor(semesterID){
		this.semesterID = semesterID;
	}

	async makeMigration(){
		try{
			let semester = await this.generateSemester();
			await this.uploadDataBase(semester);
		}catch(err){
			console.log(err);
		}
	}

	async generateSemester(){
		let semesterManager = new MapSemester(this.semesterID);
		let semester = await semesterManager.createSemester();
		if(!semester.success) throw semester.errors;
		return semester.data;
	}

	async uploadDataBase(semester){
		let client;

		try{
			client = await DataBase.getClient();
			let db = client.db(config.database.mongodb.db);
			let collection = db.collection('semester');
			let insert = await collection.insertOne(semester);
			if(!insert.result.ok) throw "No se ha logrado registrar el semestre";
			console.log(`Semestre ${semester.numero} registrado exitosamente.`);
		}catch(err){
			console.log(`Semestre ${semester.numero} no se ha registrado correctamente.`);
			console.log(err);
		}finally{
			client.close();
		}
	}
}

async function main(){
	let migration = new MigrateSemester(2);
	await migration.makeMigration();
	console.log('Fin...');
}

main();
