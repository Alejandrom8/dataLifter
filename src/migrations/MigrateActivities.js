const DataBase = require('../DataBase');

class MigrateActivities {
    constructor(activities) {
        this.activities = activities;
    }

    async migrate() {
        let client, collection, result = {success: false};

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

module.exports = MigrateActivities;