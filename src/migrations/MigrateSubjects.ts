import { Collection, MongoClient } from 'mongodb';
import DataBase from '../DataBase';
import Subject from '../entities/Subject';
import {ServiceResult} from '../types';

export default class MigrateSubjects {

    public subjects: Subject[];

    /**
     * 
     * @param subjects - the subjects to be migrated
     */
    constructor(subjects: Subject[]) {
        this.subjects = subjects;
    }

    /**
     * @returns {Promise} {succes, errors?}
     */
    async migrate(): Promise<ServiceResult> {
        let result:ServiceResult = {success: false};
        let collection: Collection, client: MongoClient;

        try{
            [collection, client] = await DataBase.getCollection('subject');
            let insert = await collection.insertMany(this.subjects);
            if(!insert.result.ok) throw 'No se logro subir correctamente las asignaturas';

            result.success = true;
        }catch(error){
            console.log(error);
            result.errors = error;
        }finally{
            client.close();
        }

        return result;
    }
}