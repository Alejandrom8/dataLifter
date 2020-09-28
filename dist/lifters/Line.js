"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Line {
    constructor(line) {
        /**
         * get just the numbers of a line of thext.
         * @param {String} line - the line of text where the numbers will be
         * extracted.
         * @returns {String} the first number founded.
         */
        this.getNumber = () => this.getElement(/[0-9]+/g);
        this.line = line;
    }
    /**
     *
     * @param {string} line
     * @param {RegExp} matcher
     * @returns {String} the first element that matches with the matcher RegExp
     */
    getElement(matcher) {
        if (!this.line)
            return '';
        let result = this.line.match(matcher);
        return result ? result[0] : '';
    }
    /**
     *
     * @param {String} line
     * @returns {Boolean} true if the line is '' or null or undefined or does not
     * contain anything but spaces.
     */
    isEmpty() {
        return !this.line ||
            this.line.replace(/\s+/g, '').length === 0;
    }
    /**
     * creates a new string with just letters.
     * @param {String} line
     * @returns {String} a line with just alfabetic characters (a-zA-Z)
     */
    getText() {
        if (!this.line)
            return '';
        let result = this.line.toLowerCase();
        result = result.replace(/[\s.;:,?%0-9]+/g, '');
        return result;
    }
}
exports.default = Line;
//# sourceMappingURL=Line.js.map