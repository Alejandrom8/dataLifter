"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const cheerio_1 = __importDefault(require("cheerio"));
const crawler_request_1 = __importDefault(require("crawler-request"));
/**
 * groups a bounch of functions that help to make web scrapping
 * @class
 */
class Scraper {
    /**
    *	scrap - consults the specified page and returns the html of that page.
    *	@param {string} URL - the url where are going to get the data.
    *	@param {string} [encoding = 'utf8'] - the encoding used to decode
    *   the returned content.
    *	@returns {Promise} the html of the consulted url.
    */
    static scrap(URL, encoding = 'utf8') {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield new Promise((resolve, reject) => {
                request_promise_1.default({ uri: URL, encoding: encoding })
                    .then(html => resolve(html))
                    .catch(err => reject(err));
            });
            if (!result)
                throw 'can not get the content of the specified url';
            return result;
        });
    }
    /**
    * this function should determine if an html line is valid or not.
    * @callback filterFunction
    * @param {String} element - the n line of the scrapped webpage.
    * @return {String} - the filtered element
    */
    /**
    * @param {Object} arguments - the object containing the arguments.
    * @param {String} arguments.cssSelector - the css selector to get some
    * elements from the HTML.
    * @param {String} arguments.html - the html that whill be processed.
    * @param {filterFunction} arguments.filter - the function that will proccess
    * all the elements that match with the CSS selector.
    * @param {Object} [arguments.steps = {init: 0, size: 1}] - the steps that
    * will make each iteration of this process.
    * @param {Number} [arguments.steps.init = 0] - where the filter will begin
    * to be applied.
    * @param {Number} [arguments.steps.size = 1] - the size of the step that
    * will make each iteration.
    * @returns {Array} - an array with the selected and filtered elements from
    * the html.
    */
    static getElementsFromHTML({ cssSelector, html, filter, steps = { init: 0, size: 1 } }) {
        let elements = cheerio_1.default(cssSelector, html);
        let elementsFiltered = [];
        for (let i = steps.init; i < Object.keys(elements).length; i += steps.size) {
            if (typeof elements[i] == 'undefined')
                continue;
            elementsFiltered.push(filter(elements[i]));
        }
        return elementsFiltered;
    }
}
exports.default = Scraper;
/**
 *
 * @param {String} URL
 */
Scraper.scrapPDF = (URL) => __awaiter(void 0, void 0, void 0, function* () { return yield crawler_request_1.default(URL); });
//# sourceMappingURL=Scraper.js.map