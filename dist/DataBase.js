"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_json_1 = __importDefault(require("./config.json"));
let _connection;
class DataBase {
    // /**
    //  *
    //  * @returns {Promise<MongoClient>}
    //  */
    // public static async getClient (): Promise<MongoClient> {
    //     let client = await MongoClient.connect(
    //         config.database.mongodb.url,
    //         config.database.mongodb.options
    //     )
    //     if(!client) throw "No se pudo conectar a la base de datos"
    //     return client
    // }
    static initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (_connection) {
                console.warn('Trying to create DB connection again');
                return _connection;
            }
            let client = yield mongodb_1.MongoClient.connect(config_json_1.default.database.mongodb.url, config_json_1.default.database.mongodb.options);
            if (!client)
                throw new Error('the connection could not be created');
            console.log(`Database connected at: ${config_json_1.default.database.mongodb.url}.`);
            _connection = client;
            return _connection;
        });
    }
    static getConnection() {
        if (!_connection)
            throw new Error('connection is no initialized, call initDb first');
        return _connection;
    }
    /**
     *
     * @param {String} collectionName - the name of the mongo collection.
     * @returns {Collection}
     */
    static getCollection(collectionName) {
        let client = DataBase.getConnection();
        let db = client.db(config_json_1.default.database.mongodb.db);
        let collection = db.collection(collectionName);
        return collection;
    }
}
exports.default = DataBase;
//# sourceMappingURL=DataBase.js.map