"use strict";

const ActivitiesCreator = require('../creators/Activities.creator');
const DataBase = require('../DataBase');
const config = require('../../config');

class MigrateActivities{

    constructor(semesterID){
        this.semesterID = semesterID;
    }

    async migrate(){
        let result = {success: false, errors: []};
        
        let subjects = await this.getSubjects();
        if(!subjects.success) {
            console.log(`Error while getting subjects`,subjects.errors);
            return
        }

        subjects = subjects.data;
        let inserResult;

        for(let i = 0; i < subjects.length; i++){
            let subject = subjects[i];
            let activities = await this.getActivities(subject);
            inserResult = await this.insertActivities(activities);
            if(!inserResult.success) result.errors.push(inserResult.errors);
        }

        if(!result.errors.length) result.success = true;

        return result;
    }

    async insertActivities(activities){
        let client, result = {success: false};
        try{
            client = await DataBase.getClient();
            let db = client.db(config.database.mongodb.db);
            let collection = db.collection('activities');
            let insert = await collection.insertOne(activities);
            if(!insert.result.ok) throw 'No se logro insertar el dato';
            result.success = true;
        }catch(error){
            result.errors = error;
            console.log(error);
        }finally{
            client.close();
        }

        return result;
    }

    async getActivities(subject){
        let act_creator = new ActivitiesCreator(subject);
        let activities = await act_creator.createActivities();
        return activities;
    }

    async getSubjects(){
        let semester = this.semesterID;
        let collection, client, result = {success: false};

        try{
            [collection, client] = await DataBase.getCollection('subject');
            let query = await new Promise((resolve, reject) => {
                collection.find({ semesterID: semester}).toArray(function(err, res){
                    client.close();
                    if(err) reject(err);
                    resolve(res);
                });
            });
            if(!query) throw 'No hay asignaturas para este semestre';
            result.success = true;
            result.data = query;
        }catch(error){
            console.log(error);
            result.errors = error;
        }

        return result;
    }

}

module.exports = MigrateActivities;

// async function main(){
//     let manager = new MigrateActivities(1);
//     let result = await manager.migrate();
//     if(result.success){
//         console.log('Asignaturas migradas con exito');
//     }
// }

// main();