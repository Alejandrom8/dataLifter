const MongoClient = require('mongodb').MongoClient,
      config = require('../config');

class DataBase {
    /**
     *
     * @returns {Promise<MongoClient>}
     */
    static async getClient() {
        let client = await MongoClient.connect(
            config.database.mongodb.url,
            config.database.mongodb.options
        );
        if(!client) throw "No se pudo conectar a la base de datos";
        return client;
    }

    /**
     *
     * @param {String} collectionName - the name of the mongo collection.
     * @returns {Promise<(Collection|MongoClient)[]>}
     */
    static async getCollection(collectionName) {
        let client = await DataBase.getClient();
        let db = client.db(config.database.mongodb.db);
        let collection = db.collection(collectionName);
        return [collection, client];
    }
}

module.exports = DataBase;