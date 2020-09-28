"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = __importDefault(require("../entities/Module"));
const Activity_1 = __importDefault(require("../entities/Activity"));
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
        let taggedActivities = [];
        let taggedModules = this.modules.modulesList.map((module, moduleIndex) => {
            let tm = new Module_1.default(this.modules.subjectID, module.unidad, moduleIndex);
            taggedActivities.push(...this.getSeparatedActivities(tm.moduleID, module.actividades));
            return tm;
        });
        return [taggedModules, taggedActivities];
    }
    /**
     *
     * @param {String} moduleID
     * @param {[]} activities
     */
    getSeparatedActivities(moduleID, activities) {
        return activities.map((act, actIndex) => (new Activity_1.default(moduleID, act.text, actIndex, act.actividad)));
    }
}
exports.default = Tagger;
module.exports = Tagger;
//# sourceMappingURL=Tagger.js.map