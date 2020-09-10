const SubjectsCreator = require('../creators/Subjects.creator'),
      ModulesCreator = require('../creators/Modules.creator'),
      MigrateSubjects = require('../migrations/MigrateSubjects'),
      MigrateModules = require('../migrations/MigrateModules'),
      MigrateActivities = require('../migrations/MigrateActivities');

let SEMESTER = parseInt(process.env.SEMESTER);

if(!SEMESTER) {
   console.log("SEMESTER option is not specified")
   return
}

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
      let pureSubjects = await subjectsCreatorManager.createSubjects();
      console.log(`Created ${pureSubjects.length} subjects`);

      //getting modules and activities for each subject.
      let [
         modulesToMigrate,
         activitiesToMigrate
      ] = await createModulesAndActivities(pureSubjects);

      let migrators = [MigrateSubjects, MigrateModules, MigrateActivities];
      let elementsToMigrate = [pureSubjects, modulesToMigrate, activitiesToMigrate];
      let labels = ['subjects', 'modules', 'activities'];

      for(let i = 0; i < elementsToMigrate.length; i++) {
          let ok = await migrateObjects(
              migrators[i],
              elementsToMigrate[i],
              labels[i]
          );
          if(!ok) break;
      }

      console.log(`Program finished in : ${Date.now() - start}ms`);
})();

async function migrateObjects(migrator, objects, label) {
    let migrationManager = new migrator(objects);
    let result = await migrationManager.migrate();

    if(!result.success) {
        console.log(result.errors);
        return false;
    }

    console.log("Migrated " + objects.length + " " + label);
    return true;
}

async function createModulesAndActivities(subjects) {
   let modulesToMigrate = [], activitiesToMigrate = [];

   for(let subject of subjects) {

      //creating modules and activities
      let modulesCreatorManager = new ModulesCreator(subject);
      let result = await modulesCreatorManager.createModules();
      
      modulesToMigrate.push(...result.modules);
      activitiesToMigrate.push(...result.activities);

      console.log(`subject ${subject.key.key}`)
      console.log(`----Created ${result.modules.length} modules`)
      console.log(`----Created ${result.activities.length} activities`)
   }

  return [modulesToMigrate, activitiesToMigrate];
}