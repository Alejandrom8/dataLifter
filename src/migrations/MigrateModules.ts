import DataBase from '../DataBase';
import Module from '../entities/Module';
import { ServiceResult } from '../types';

export default class MigrateModules {

    private modules: Module[]

    constructor(modules: Module[]) {
        this.modules = modules;
    }

    async migrate(): Promise<ServiceResult> {
        let result: ServiceResult = {success: false};

        try {
            if(!this.modules.length) 
                throw `The modules array is empty, pass migration`;

            let [collection, client] = await DataBase.getCollection('module');
            let insert = await collection.insertMany(this.modules);
            client.close();

            if(!insert.result.ok) throw 'No se logro insertar el dato';
            result.success = true;
        } catch(error) {
            result.errors = error;
            console.log(error);
        }

        return result;
    }
}