class Modules {
    /**
     *
     * @param {String} subjectID - system generated ID for the subject to which
     * this modules belongs.
     * @param {object[]} modules - an array of Module objects.
     */
    constructor(subjectID, modules) {
        this.subjectID = subjectID;
        this.modulesList = modules;
    }
}
module.exports = Modules;
//# sourceMappingURL=Modules.js.map