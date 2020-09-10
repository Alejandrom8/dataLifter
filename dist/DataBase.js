var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MongoClient = require('mongodb').MongoClient, config = require('../config');
class DataBase {
    /**
     *
     * @returns {Promise<MongoClient>}
     */
    static getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield MongoClient.connect(config.database.mongodb.url, config.database.mongodb.options);
            if (!client)
                throw "No se pudo conectar a la base de datos";
            return client;
        });
    }
    /**
     *
     * @param {String} collectionName - the name of the mongo collection.
     * @returns {Promise<(Collection|MongoClient)[]>}
     */
    static getCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield DataBase.getClient();
            let db = client.db(config.database.mongodb.db);
            let collection = db.collection(collectionName);
            return [collection, client];
        });
    }
}
module.exports = DataBase;
//# sourceMappingURL=DataBase.js.map