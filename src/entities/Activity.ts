import { genRandomKey } from '../helpers/generators';

/**
 * creates an instance of an Activity object.
 * @class
 */
export default class Activity {

    public activityID: string;
    public moduleID: string;
    public content: string;
    public index: number;
    public activityTitle: string;
    
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
    constructor(moduleID: string, content: string, index: number, activityTitle: string) {
        this.activityID = genRandomKey();
        this.moduleID = moduleID;
        this.content = content;
        this.index = index;
        this.activityTitle = activityTitle;
    }
}