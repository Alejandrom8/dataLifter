const MapModules = require('../lifters/MapModules'),
      Tagger = require('../normalizers/Tagger');

/**
 * ModulesCreator its a "creator" for Module and Activity objects, it's simple
 * method "createModules" creates an array of Module objets and other of
 * Activity objects.
 * @class
 */
class ModulesCreator {
    /**
     * 
     * @param {object} param0
     * @param {Number} param0.semesterID - the key of the semester (1-9)
     * @param {String} param0.subjectID - the system generated ID for the
     * subject to which this modules will belongs.
     * @param {String} param0.planDeTrabajoURL - the URL from where will be taken the
     * data for the modules and activities.
     */
    constructor({semesterID, subjectID, planDeTrabajoURL}) {
        this.semesterID = semesterID;
        this.subjectID = subjectID;
        this.subjectPDF = planDeTrabajoURL;
    }

    /**
     * creates the modules and activities for the given subject ready to be
     * uploaded to the database.
     * @returns {Promise<{modules: object[], activities: object[]}>}
     */
    async createModules() {
        let map_manager = new MapModules(
            this.semesterID, 
            this.subjectID, 
            this.subjectPDF
        );
        let modules = await map_manager.formGroups();
        let tag_manager = new Tagger(modules);
        let [
            taggedModules, 
            taggedActivities
        ] = tag_manager.getSeparatedModulesAndActivities();

        return {
            modules: taggedModules,
            activities: taggedActivities
        }
    }
}

module.exports = ModulesCreator;

/*
FAST TEST

(async function test() {
    let creator = new ModulesCreator({
        semesterID: 1,
        subjectID: '9439FFA',
        planDeTrabajoURL: "http://fcaenlinea1.unam.mx/planes_trabajo/deliver.php?f=asesor/upload/1141_TODOS.pdf"
    });

    let modules = await creator.createModules();
    console.log(modules);
})();*/