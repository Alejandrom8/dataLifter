const { genRandomKey } = require('../helpers/generators');
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
        this.moduleID = genRandomKey();
        this.subjectID = subjectID;
        this.moduleTitle = moduleTitle;
        this.index = index;
    }
}
module.exports = Module;
//# sourceMappingURL=Module.js.map