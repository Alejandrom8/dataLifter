import { Collection, MongoClient } from 'mongodb';
import DataBase from '../DataBase';
import Activity from '../entities/Activity';
import { ServiceResult } from '../types';

export default class MigrateActivities {

    private activities: Activity[]

    constructor(activities: Activity[]) {
        this.activities = activities;
    }

    async migrate(): Promise<ServiceResult> {
        let client: MongoClient,
            collection: Collection,
            result: ServiceResult = {success: false};

        try {
            [collection, client] = await DataBase.getCollection('activity');
            let insert = await collection.insertMany(this.activities);
            if(!insert.result.ok) throw 'No se logro insertar el dato';
            result.success = true;
        } catch(error) {
            result.errors = error;
            console.log(error);
        } finally {
            client.close();
        }

        return result;
    }
}