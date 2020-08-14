const MapModules = require('../lifters/MapModules'),
      Tagger = require('../normalizers/Tagger');

class ModulesCreator {
    constructor({semesterID, subjectID, planDeTrabajoURL}) {
        this.semesterID = semesterID;
        this.subjectID = subjectID;
        this.subjectPDF = planDeTrabajoURL;
    }

    /**
     * @returns {Promise}
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