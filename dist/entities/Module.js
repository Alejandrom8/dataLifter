"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generators_1 = require("../helpers/generators");
/**
 * creates an instance of the Module class
 * @class
 */
class Module {
    /**
     *
     * @param {String} subjectID - the university key of the subject to which
     * this module belongs.
     * @param {String} moduleTitle - the title for this module.
     * @param {Number} index - the index that sort each module.
     */
    constructor(subjectID, moduleTitle, index) {
        this.moduleID = generators_1.genRandomKey();
        this.subjectID = subjectID;
        this.moduleTitle = moduleTitle;
        this.index = index;
    }
}
exports.default = Module;
//# sourceMappingURL=Module.js.map