import Module from "../Module";
import {PreModule} from '../../lifters/MapModules';

export default class Modules {

    public subjectID: string;
    public modulesList: PreModule[];

    /**
     * 
     * @param {String} subjectID - system generated ID for the subject to which
     * this modules belongs.
     * @param {object[]} modules - an array of Module objects.
     */
    constructor(subjectID: string, modules: PreModule[]) {
        this.subjectID = subjectID;
        this.modulesList = modules;
    }
}