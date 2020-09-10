"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = __importDefault(require("./Key"));
const generators_1 = require("../helpers/generators");
/**
 * creates a new Subject instance.
 * @class
 */
class Subject {
    /**
     * @param {number} semesterID - the number of the semester to which this
     * subject belongs.
     * @param {String} name - name of the subject.
     * @param {String} key - the real key (that one given by the university)
     * that identifies this subject.
     * @param {String} [planDeTrabajoURL = ''] - URL direction for the "plan de
     * trabajo" PDF document for this subject. This one will only exists for the
     * SUA education mode.
     * @param {String} [apunteURL = ''] - URL direction for the "apunte" PDF
     * document of this subject. This one will only exists for the SUA education
     * mode.
     * @param {String} [actividadesURL = ''] - URL direction for the "actividades"
     * PDF document of this subject. This one will only exists for the SUA
     * education mode.
     */
    constructor(semesterID, name, key, planDeTrabajoURL = '') {
        this.subjectID = generators_1.genRandomKey();
        this.semesterID = semesterID;
        this.key = new Key_1.default(key);
        this.name = name;
        this.planDeTrabajoURL = planDeTrabajoURL;
    }
    /**
     *
     * @param {String} apunteURL - the URL of the apunte PDF for this subject
     * object.
     * @param {String} actividadesURL - the URL for the actividades PDF for this
     * subject object.
     */
    setMaterials(apunteURL, actividadesURL) {
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
    }
}
exports.default = Subject;
//# sourceMappingURL=Subject.js.map