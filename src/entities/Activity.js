const { genRandomKey } = require('../helpers/generators');

/**
 * creates an instance of an Activity object.
 * @class
 */
class Activity {
    /**
     * 
     * @param {String} moduleID - the system generated key for the module to
     * wich this activity belongs.
     * @param {String} content - the instructions for this activity.
     * @param {String} index - the index that sort each module. (1 - n) where n
     * its the number of activities, this number should be restarted for every
     * module.
     */
    constructor(moduleID, content, index) {
        this.activityID = genRandomKey();
        this.moduleID = moduleID;
        this.content = content;
        this.index = index;
    }
}

module.exports = Activity;