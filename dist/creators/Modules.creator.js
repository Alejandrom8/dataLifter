"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MapModules_1 = __importDefault(require("../lifters/MapModules"));
const Tagger_1 = __importDefault(require("../normalizers/Tagger"));
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
    constructor({ semesterID, subjectID, planDeTrabajoURL }) {
        this.semesterID = semesterID;
        this.subjectID = subjectID;
        this.subjectPDF = planDeTrabajoURL;
    }
    /**
     * creates the modules and activities for the given subject ready to be
     * uploaded to the database.
     * @returns {Promise<{modules: object[], activities: object[]}>}
     */
    createModules() {
        return __awaiter(this, void 0, void 0, function* () {
            let map_manager = new MapModules_1.default(this.semesterID, this.subjectID, this.subjectPDF);
            let modules = yield map_manager.formGroups();
            let tag_manager = new Tagger_1.default(modules);
            let [taggedModules, taggedActivities] = tag_manager.getSeparatedModulesAndActivities();
            return {
                modules: taggedModules,
                activities: taggedActivities
            };
        });
    }
}
exports.default = ModulesCreator;
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
//# sourceMappingURL=Modules.creator.js.map