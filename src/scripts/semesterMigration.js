import SubjectsCreator from '../creators/Subjects.creator'
import ModulesCreator from '../creators/Modules.creator'
import MigrateSubjects from '../migrations/MigrateSubjects'
import MigrateModules from '../migrations/MigrateModules'
import MigrateActivities from '../migrations/MigrateActivities'

/**
 * This function should create the records into the FCA database for the
 * subjects, modules and activities for an specified semester:
 * 1. generate subjects
 * 2. generate modules and activities
 * 3. migrate subjects
 * 4. migrate modules and activities
 */
export default async function semesterMigration (SEMESTER) {
    const start = Date.now() //counting execution time

    //getting subjects for indicated semester.
    let subjectsCreatorManager = new SubjectsCreator(SEMESTER)
    let pureSubjects = await subjectsCreatorManager.createSubjects()

    console.log(`Created ${pureSubjects.length} subjects`)

    //getting modules and activities for each subject.
    let [
        modulesToMigrate,
        activitiesToMigrate
    ] = await createModulesAndActivities(pureSubjects)

    await Promise.all([
        { label: 'subjects', migrator: MigrateSubjects, objects: pureSubjects },
        { label: 'modules', migrator: MigrateModules, objects: modulesToMigrate },
        { label: 'activities', migrator: MigrateActivities, objects: activitiesToMigrate }
    ].map(async tm => await migrateObjects(tm)))

    console.log(`Program finished in : ${Date.now() - start}ms`)
}

/**
 * 
 * @param {} subjects 
 */
async function createModulesAndActivities (subjects) {
    let modulesToMigrate = []
    let activitiesToMigrate = []

    for (let subject of subjects) {
       let modulesCreatorManager = new ModulesCreator(subject)
       let { modules, activities } = await modulesCreatorManager.createModules()
       
       modulesToMigrate.push(...modules)
       activitiesToMigrate.push(...activities)
 
       console.log(`subject ${subject.key.key}`)
       console.log(`----Created ${modules.length} modules`)
       console.log(`----Created ${activities.length} activities`)
    }
 
   return [modulesToMigrate, activitiesToMigrate]
}

async function migrateObjects ({ label, migrator, objects }) {
    let migrationManager = new migrator(objects)
    let result = await migrationManager.migrate()

    if (!result.success) {
        console.log(result.errors)
        return false
    }

    console.log("Migrated " + objects.length + " " + label)
    return true
}