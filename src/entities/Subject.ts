import Key from './Key'
import { genRandomKey } from '../helpers/generators'

/**
 * creates a new Subject instance.
 * @class
 */
export default class Subject {

    public subjectID: string
    public semesterID: number
    public name: string
    public key: Key
    public planDeTrabajoURL: string
    public apunteURL: string | string[]
    public actividadesURL: string | string[]
    
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
    constructor (
        semesterID: number,
        name: string, 
        key: string, 
        planDeTrabajoURL: string = ''
    ) {
        this.subjectID = genRandomKey()
        this.semesterID = semesterID
        this.key = new Key(key)
        this.name = name
        this.planDeTrabajoURL = planDeTrabajoURL
    }

    /**
     * 
     * @param {String} apunteURL - the URL of the apunte PDF for this subject 
     * object.
     * @param {String} actividadesURL - the URL for the actividades PDF for this
     * subject object.
     */
    setMaterials (apunteURL: string | string[], actividadesURL: string | string[]) {
        this.apunteURL = apunteURL
        this.actividadesURL = actividadesURL
    }
}