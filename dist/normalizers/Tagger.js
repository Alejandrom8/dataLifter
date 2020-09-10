const Module = require('../entities/Module'), Activity = require('../entities/Activity');
class Tagger {
    /**
     *
     * @param {Modules} modules
     */
    constructor(modules) {
        this.modules = modules;
    }
    /**
     *
     * @returns {[][]}
     */
    getSeparatedModulesAndActivities() {
        let taggedModules = [], taggedActivities = [];
        this.modules.modulesList.forEach((module, moduleIndex) => {
            let tm = new Module(this.modules.subjectID, module.unidad, moduleIndex);
            taggedModules.push(tm);
            taggedActivities.push(...this.getSeparatedActivities(tm.moduleID, module.actividades));
        });
        return [taggedModules, taggedActivities];
    }
    /**
     *
     * @param {String} moduleID
     * @param {[]} activities
     */
    getSeparatedActivities(moduleID, activities) {
        return activities.map((act, actIndex) => {
            return new Activity(moduleID, act.text, actIndex, act.actividad);
        });
    }
}
module.exports = Tagger;
//# sourceMappingURL=Tagger.js.map