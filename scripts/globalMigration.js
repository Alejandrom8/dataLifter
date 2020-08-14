const SubjectsCreator = require('../src/creators/Subjects.creator'),
      ModulesCreator = require('../src/creators/Modules.creator'),
      MigrateSubjects = require('../src/migrations/MigrateSubjects'),
      MigrateModules = require('../src/migrations/MigrateModules'),
      MigrateActivities = require('../src/migrations/MigrateActivities');

let SEMESTER = process.env.SEMESTER;

if(!SEMESTER) {
   console.log("SEMESTER option is not especified")
   return
}

SEMESTER = parseInt(SEMESTER);

(async function main() {
    /**
     * This function should create the records into the FCA database for the
     * subjects, modules and activities for an specified semester:
     * 1. generate subjects
     * 2. generate modules and activities
     * 3. migrate subjects
     * 4. migrate modules and activities
     */   

     const start = Date.now();// starting time

     //getting subjects.
     let subjectsCreatorManager = new SubjectsCreator(SEMESTER);
     let subjectsToMigrate = await subjectsCreatorManager.createSubjects();
      console.log(`Created ${subjectsToMigrate.length} subjects`);
     //getting modules and activities for each subject.

     let [
         modulesToMigrate, 
         activitiesToMigrate
      ] = await createModulesAndActivities(subjectsToMigrate);

     //migrating subjects
     let SMM = new MigrateSubjects(subjectsToMigrate);
     let subjectsMigrationResult = await SMM.migrate();

     if(!subjectsMigrationResult.success) {
        console.log(subjectsMigrationResult.errors);
        return
     }

     console.log(`Migrated ${subjectsToMigrate.length} subjects`);

     //migrating modules
     let MMM = new MigrateModules(modulesToMigrate);
     let modulesMigrationResult = await MMM.migrate();

     if(!modulesMigrationResult.success) {
        console.log(modulesMigrationResult.errors);
        return
     }

     console.log(`Migrated ${modulesToMigrate.length} modules`);

     //migrating activities
     let AMM = new MigrateActivities(activitiesToMigrate);
     let activitiesMigrationResult = await AMM.migrate();

     if(!activitiesMigrationResult.success) {
        console.log(activitiesMigrationResult.errors);
        return
     }

     console.log(`Migrated ${activitiesToMigrate.length} activities`);

     console.log(`Program finished in : ${Date.now() - start}ms`);
})();

async function createModulesAndActivities(subjects){
   let modulesToMigrate = [], activitiesToMigrate = [];

   for(let subject of subjects){
      let modulesCreatorManager = new ModulesCreator(subject);
      let result = await modulesCreatorManager.createModules();

      console.log(`Created ${result.modules.length} modules and ${result.activities.length} activities for subject ${subject.key.key}`)
      modulesToMigrate.push(...result.modules);
      activitiesToMigrate.push(...result.activities);
   }

  return [modulesToMigrate, activitiesToMigrate];
}