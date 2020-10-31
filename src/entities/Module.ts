import { genRandomKey } from '../helpers/generators';

/**
 * creates an instance of the Module class
 * @class
 */
export default class Module {

    public moduleID: string
    public subjectID: string
    public moduleTitle: string
    public index: number

    /**
     * 
     * @param {String} subjectID - the university key of the subject to which
     * this module belongs.
     * @param {String} moduleTitle - the title for this module.
     * @param {Number} index - the index that sort each module.
     */
    constructor (subjectID: string, moduleTitle: string, index: number) {
        this.moduleID = genRandomKey()
        this.subjectID = subjectID
        this.moduleTitle = moduleTitle
        this.index = index
    }
}