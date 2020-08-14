const DataBase = require('../DataBase');

class MigrateSubjects{
    /**
     * 
     * @param {{
     * semesterID: Number,
     * name: String,
     * key: Object,
     * planDeTrabajoURL: String,
     * apunteURL: String,
     * actividadesURL: String}[]} subjects 
     */
    constructor(subjects){
        this.subjects = subjects;
    }

    /**
     * @returns {Promise} {succes, errors?}
     */
    async migrate(){
        let result = {success: false};
        let collection, client;
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

module.exports = MigrateSubjects;