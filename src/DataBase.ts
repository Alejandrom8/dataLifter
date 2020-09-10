import { MongoClient, Collection } from 'mongodb';
import config from './config.json';

export default class DataBase {
    /**
     *
     * @returns {Promise<MongoClient>}
     */
    public static async getClient(): Promise<MongoClient> {
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
    public static async getCollection(collectionName: string): Promise<(Collection | MongoClient)[]> {
        let client = await DataBase.getClient();
        let db = client.db(config.database.mongodb.db);
        let collection = db.collection(collectionName);
        return [collection, client];
    }
}