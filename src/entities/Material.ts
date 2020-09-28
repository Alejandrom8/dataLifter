import Key from './Key'

/**
 * creates an instance of the Material class.
 * @class
 */
export default class Material {

    public key: Key
    public apunteURL: string
    public actividadesURL: string
    
    /**
     * 
     * @param { String } key - the real key (that one given by the university)
     * that identifies this subject material.
     * @param { URL } apunteURL - the URL to the apunte PDF online file for this
     * bunch of materials.
     * @param { URL } actividadesURL - the URL to the actividades PDF online
     * file for this bunch of materials.
     */
    constructor (key: string, apunteURL: string, actividadesURL: string) {
        this.key = new Key(key)
        this.apunteURL = apunteURL
        this.actividadesURL = actividadesURL
    }
}