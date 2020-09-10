import Module from '../entities/Module';
import Activity from '../entities/Activity';
import Modules from '../entities/groupers/Modules';


export default class Tagger {

    public modules: Modules;

    /**
     * 
     * @param {Modules} modules 
     */
    constructor(modules: Modules) {
        this.modules = modules;
    }

    /**
     *
     * @returns {[][]}
     */
    getSeparatedModulesAndActivities(): (Module[] | Activity[])[] {
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

    /**
     * 
     * @param {String} moduleID
     * @param {[]} activities
     */
    getSeparatedActivities(moduleID: string, activities: {text: string, actividad: string}[]): Activity[] {
        return activities.map( (act, actIndex: number) => {
            return new Activity(
                moduleID,
                act.text,
                actIndex,
                act.actividad
            )
        });
    }
}

module.exports = Tagger;