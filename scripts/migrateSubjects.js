const SubjectsCreator = require('../src/creators/Subjects.creator');
const MigrateSubjects = require('../src/migrations/MigrateSubjects');

const semester = process.env.SEMESTER || 1;

async function generateSubjects(semesterID){
    let subjects_manager = new SubjectsCreator(semesterID);
    let subjects = await subjects_manager.createSubjects();
    if(!subjects){
        console.log('No se obtuvieron las asignaturas');
        return
    }
    return subjects;
}

async function migrateSubjecs(subjects){
    let migration_manager = new MigrateSubjects(subjects);
    let result = await migration_manager.uploadSubjects();
    return result.success;
}

(async function main(){
    let subjects = await generateSubjects(semester);
    let migration_result = await migrateSubjecs(subjects);
    migration_result ? 
        console.log('Se han insertado correctamente las asignaturas') :
        console.log('Hubo un error durante la migración de las asignaturas');
})();

