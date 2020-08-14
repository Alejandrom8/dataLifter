const MongoClient = require('mongodb').MongoClient,
      config = require('../config');

class DataBase{
    static async getClient() {
        let client = await MongoClient.connect(
            config.database.mongodb.url,
            config.database.mongodb.options
        );
        return DataBase.evalClient(client);
    }

    static evalClient(client) {
        if(!client){
            throw "No se pudo conectar a la base de datos";
        }
        return client;
    }

    static async getCollection(name) {
        let client = await DataBase.getClient();
        let db = client.db(config.database.mongodb.db);
        let collection = db.collection(name);
        return [collection, client];
    }
}

module.exports = DataBase;