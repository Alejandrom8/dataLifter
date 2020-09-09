const MigrateActivities = require('../src/migrations/MigrateActivities');

let semester = process.env.SEMESTER || "1";

(async function main(){
    let map_manager = new MigrateActivities(semester);
    let result = await map_manager.migrate();
    if(result.success){
        console.log('Asignaturas migradas con exito');
    }else{
        console.log(result.errors);
    }
})()