const SemesterCreator = require('./src/creators/Semester.creator'),
      MigrateSemester = require('./src/migrations/MigrateSemester');

const semesterID = process.env.SEMESTER || 1;

async function main(){
    let semester_manager = new SemesterCreator(semesterID);
    console.log('Generating the object for semester ' + semesterID + '...\n');
    let result = await semester_manager.createSemester();
    if(!result.success) console.log(result.errors);
    let migration_manager = new MigrateSemester(result.data);
    console.log('Making migration...\n');
    let migration_result = await migration_manager.uploadDataBase();
    if(!migration_result.success) console.log(migration_result.errors);
    console.log('Migration completed with success\n');
}

main();