"use strict";

const DataBase = require('../DataBase');

class MigrateModules {

    constructor(modules) {
        this.modules = modules;
    }

    async migrate() {
        let result = {success: false};

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

module.exports = MigrateModules;