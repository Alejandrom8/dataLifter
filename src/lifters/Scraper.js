"use strict";

const rp = require('request-promise'),
	  $ = require('cheerio'),
	  crawler = require('crawler-request');

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
	static async scrap(URL, encoding = 'utf8') {
		let result = await new Promise((resolve, reject) => {
			let config = {uri: URL, encoding: encoding};
			rp(config)
				.then( html => resolve(html))
				.catch( err => reject(err));
		});
		if(!result) throw 'can not get the content of the specified url';
		return result;
    }

	/**
	 * 
	 * @param {String} URL 
	 */
	static async scrapPDF(URL) {
		let response = await crawler(URL);
		return response;
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
    static getElementsFromHTML({
		cssSelector,
		html,
		filter,
		steps = {init: 0, size: 1}
	}) {
        let elements = $(cssSelector, html),
            elementsFiltered = [];

        for (let i = steps.init; i < Object.keys(elements).length; i += steps.size) {
            if(typeof elements[i] == 'undefined') continue;
            elementsFiltered.push(filter(elements[i]));
        }

        return elementsFiltered;
    }
}

module.exports = Scraper;
