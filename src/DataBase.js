const MongoClient = require('mongodb').MongoClient,
      config = require('../config');

class DataBase{
    constructor(){
        this.db = config.database.mongodb.db;
        this.collection = config.database.mongodb.user_collection;
    }

    static async getClient(){
        let client = await MongoClient.connect(config.database.mongodb.url, config.database.mongodb.options);
        return DataBase.evalClient(client);
    }

    static evalClient(client){
        if(!client){
            throw "No se pudo conectar a la base de datos";
        }
        return client;
    }
}

module.exports = DataBase;