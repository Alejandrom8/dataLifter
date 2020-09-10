"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = __importDefault(require("./Key"));
/**
 * creates an instance of the Material class.
 * @class
 */
class Material {
    /**
     *
     * @param { String } key - the real key (that one given by the university)
     * that identifies this subject material.
     * @param { URL } apunteURL - the URL to the apunte PDF online file for this
     * bunch of materials.
     * @param { URL } actividadesURL - the URL to the actividades PDF online
     * file for this bunch of materials.
     */
    constructor(key, apunteURL, actividadesURL) {
        this.key = new Key_1.default(key);
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
    }
}
exports.default = Material;
//# sourceMappingURL=Material.js.map