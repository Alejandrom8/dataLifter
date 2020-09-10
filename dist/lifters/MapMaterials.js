var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const $ = require('cheerio'), Material = require('../entities/Material'), Scraper = require('./Scraper'), config = require('../../config'), { insertionSort } = require('../normalizers/sorters');
/**
 * 	MapMaterials - an object that gets the URL's of the 'apuntes' and
 * 'acdtividades' of each subject of the specified semester.
 * @class
*/
class MapMaterials {
    /**
    *	@param {number} semesterID - the number of the semester.
    *	@param {string} [plan = '2016'] - the year of the study plan.
    */
    constructor(semesterID, plan = '2016') {
        //where we are going to get the data.
        this.baseURL = config.scraping.baseURLForMaterials;
        this.plan = plan;
        this.semesterID = semesterID;
        this.URL = `${this.baseURL}plan${this.plan}_${this.semesterID}.php`;
    }
    /**
    *	getMateriales - returns an array with the subjects of the specified semester.
    *	@returns {Promise} - an array of Material objects.
    */
    getMaterials() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = { success: false };
            try {
                const pageHTML = yield Scraper.scrap(this.URL);
                result.data = this.processHTML(pageHTML);
                result.success = true;
            }
            catch (err) {
                result.errors = err;
            }
            return result;
        });
    }
    /**
     * processHTML - process the recived html and returns an array of Material
     * objects.
     * @param {string} html - an html structure in string type.
     * @returns {Material[]} an array with the materials extracted from the HTML.
     */
    processHTML(html) {
        //gettin the 'claves'. patron: center-left-center-center. [clave, nombre, apunte, actividades];
        const generalSelector = `table.tablaamarilla > tbody tr >`, type_1 = `${generalSelector} td.tablaamarilla[valign="middle"][bgcolor="#E6E6E6"]`, type_2 = `${generalSelector} td.estilos[valign="middle"][bgcolor="#E6E6E6"]`, selector = `${type_1}, ${type_2}`;
        let subjectMaterials = this.getElementsFromHTML(selector, html);
        subjectMaterials = this.groupMaterials(subjectMaterials);
        subjectMaterials = this.checkSimilarSubjects(subjectMaterials);
        subjectMaterials = insertionSort(subjectMaterials);
        return subjectMaterials;
    }
    /**
     *
     * @param {string} cssSelector - the css selector wich will be used to
     * filter the html content.
     * @param {string} html - the html content.
     * @returns {Object[]} the filtered elements of the html based on certain
     * filters.
     */
    getElementsFromHTML(cssSelector, html) {
        const htmlElements = $(cssSelector, html);
        let elementsFiltered = [], linkCounter = 0;
        for (let i = 0; i < htmlElements.length; i++) {
            if (typeof htmlElements[i] == 'undefined')
                continue;
            let element = htmlElements[i].children[0];
            /*if the element is a colspan of two and have the indicated text,
            skip two elements. and continue to the next element.*/
            if ('data' in element) {
                if (element.data === 'Consultar plan de trabajo' ||
                    element.data === 'Consulta el plan de trabajo') {
                    elementsFiltered.push(element.data);
                    elementsFiltered.push(element.data);
                    linkCounter = 0;
                    continue;
                }
            }
            if ('attribs' in htmlElements[i] &&
                'colspan' in htmlElements[i].attribs) {
                if (htmlElements[i].attribs.colspan === '2') {
                    elementsFiltered.push(element.data);
                    elementsFiltered.push(element.data);
                    linkCounter = 0;
                    continue;
                }
            }
            if ('children' in element) { //if the element is a Video clase, skip it
                if (element.children.length > 0) {
                    if ('attribs' in element.children[0]) {
                        if ('alt' in element.children[0].attribs) {
                            if (element.children[0].attribs.alt === 'Video Clase') {
                                continue;
                            }
                        }
                    }
                }
            }
            if (linkCounter >= 2) { //apply this for elements in count 23 67 1011
                //here are just the links 
                if (element.name !== 'a') { //if the element is not the expected (a)
                    elementsFiltered.push(null);
                    continue;
                }
                element = this.baseURL + element.attribs.href;
            }
            else {
                if (element.name === 'p') { //if element has p children even text
                    element = element.children[0];
                }
                element = element.data;
            }
            elementsFiltered.push(element);
            //to determine when a block of 4 is done
            linkCounter = linkCounter === 3 ? 0 : linkCounter + 1;
        }
        return elementsFiltered;
    }
    /**
     *
     * @param {Array} subjects
     * @returns {Material[]}
     */
    groupMaterials(subjects) {
        let sorted = [], clave, apunteURL, actividadesURL, material;
        for (let i = 0; i < subjects.length; i += 4) {
            clave = typeof subjects[i] == 'undefined' ? subjects[i + 1] : subjects[i];
            clave = (clave.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "")).trim();
            apunteURL = subjects[i + 2];
            actividadesURL = subjects[i + 3];
            material = new Material(clave, apunteURL, actividadesURL);
            sorted.push(material);
        }
        return sorted;
    }
    checkSimilarSubjects(mt) {
        let checked = [];
        const withoutModifications = mt.slice();
        let generalRoundSubjectsChecked = [];
        let final = [];
        let additionalIndexes = ['a', 'c', 'i'];
        const getCoincidences = i => withoutModifications.filter((sub, index) => {
            if (withoutModifications[i].key.number === sub.key.number)
                checked.push(index);
            return withoutModifications[i].key.number === sub.key.number;
        }), subjectIsChecked = (id) => generalRoundSubjectsChecked.indexOf(id), tagCoincidences = coincidences => (coincidences.map((c, index) => {
            c.key.letter = additionalIndexes[index];
            return c;
        }));
        for (let i = 0; i < mt.length; i++) {
            //searching in all the array the keys that are repeated
            let coincidences = getCoincidences(i);
            if (coincidences.length < 1 || subjectIsChecked(withoutModifications[i].key.number)) {
                checked = [];
                continue;
            }
            //ISSUE - habrá problemas cuando admimistración e informática tengan
            //una matería en común pero contaduría no. en tal caso, quedaría así:
            //1151a (administración) 1151c (informática)...
            let changedKeys = tagCoincidences(coincidences);
            changedKeys.forEach(ck => final.push(ck));
            checked = [];
            generalRoundSubjectsChecked.push(withoutModifications[i].key);
        }
        return mt;
    }
}
module.exports = MapMaterials;
//# sourceMappingURL=MapMaterials.js.map