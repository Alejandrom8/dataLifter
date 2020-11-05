import { MongoClient, Collection } from 'mongodb'
import config from './config.json'

let _connection: MongoClient;

export default class DataBase {
    public static async initDb () {
        if (_connection) {
            console.warn('Trying to create DB connection again');
            return _connection;
        }
        let client = await MongoClient.connect(
            config.database.mongodb.url,
            config.database.mongodb.options
        )
        if (!client) throw new Error('the connection could not be created')
        console.log(`Database connected at: ${config.database.mongodb.url}.`)
        _connection = client;
        return _connection
    }

    public static getConnection () {
        if (!_connection) throw new Error('connection is no initialized, call initDb first');
        return _connection;
    }

    /**
     *
     * @param {String} collectionName - the name of the mongo collection.
     * @returns {Collection}
     */
    public static getCollection (collectionName: string): Collection {
        let client = DataBase.getConnection();
        let db = client.db(config.database.mongodb.db)
        let collection = db.collection(collectionName)
        return collection
    }
}