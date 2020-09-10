"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generators_1 = require("../helpers/generators");
/**
 * creates an instance of an Activity object.
 * @class
 */
class Activity {
    /**
     *
     * @param {String} moduleID - the system generated key for the module to
     * which this activity belongs.
     * @param {String} content - the instructions for this activity.
     * @param {String} index - the index that sort each module. (1 - n) where n
     * its the number of activities, this number should be restarted for every
     * module.
     * @param {String} activityTitle - the index read from the pdf for this activity.
     */
    constructor(moduleID, content, index, activityTitle) {
        this.activityID = generators_1.genRandomKey();
        this.moduleID = moduleID;
        this.content = content;
        this.index = index;
        this.activityTitle = activityTitle;
    }
}
exports.default = Activity;
//# sourceMappingURL=Activity.js.map