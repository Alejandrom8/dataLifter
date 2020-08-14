const Module = require('../entities/Module'),
      Activity = require('../entities/Activity');

class Tagger {

    /**
     * 
     * @param {Modules} modules 
     */
    constructor(modules) {
        this.modules = modules;
    }

    getSeparatedModulesAndActivities() {
        let taggedModules = [], taggedActivities = [];

        this.modules.modulesList.forEach( (module, moduleIndex) => {
            let tm = new Module(
                this.modules.subjectID,
                module.unidad,
                moduleIndex
            );

            taggedModules.push(tm);

            taggedActivities.push(
                ...this.getSeparatedActivities(tm.moduleID, module.actividades)
            );
        });
        
        return [taggedModules, taggedActivities];
    }

    getSeparatedActivities(moduleID, activities) {
        let taggedActivities = activities.map( (act, actIndex) => {
            return new Activity(
                moduleID,
                act.text,
                actIndex
            )
        });        
        return taggedActivities;
    }
}

module.exports = Tagger;