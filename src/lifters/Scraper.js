"use strict";

const rp = require('request-promise'),
      $ = require('cheerio');

class Scraper{
    /**
	*	scrap - consults the specified page and returns the html of that page.
	*	@param {string} URL - the url where are going to get the data.
	*	@param {string} encoding - the encoding used to decode the returned content.
	*	@return {string} the html of the consulted url.
	*/
	static async scrap(URL, encoding){
		return await new Promise((resolve, reject) => {
			let config = {uri: URL, encoding: encoding};
			rp(config)
				.then( html => resolve(html))
				.catch( err => reject(err));
		});
   }

   	/**
	* 
	* @param {string} cssSelector - the css selector to get some elements from the HTML.
	* @param {string} html - the html that whill be processed.
	* @param {function} filter - the function that will proccess all the elements that match
	*								with the CSS selector.
	* @param {Array} steps - [0] - where the filter will be applied.
	* 						 [1] - the step that will make each iteration.
	* @return {Array} - an array with the selected and filtered elements from the html.
	*/
    static getElementsFromHTML(cssSelector, html, filter, steps = [0, 1]){
        let elements = $(cssSelector, html),
            elementsFiltered = [];

        for (let i = steps[0]; i < Object.keys(elements).length; i += steps[1]) {
            if(typeof elements[i] == 'undefined') continue;
            elementsFiltered.push(filter(elements[i]));
        }

        return elementsFiltered;
    }
}

module.exports = Scraper;
