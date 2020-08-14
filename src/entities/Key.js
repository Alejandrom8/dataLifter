/**
 * Desestructures the given key into an analityc version of the same key and
 * it is grouped into a Key object.
 * @class
 */
class Key {
    /**
     * 
     * @param {String} key - a string representing a Unersity ID for a subject.
     * Commonly follows this format: "1194A". Where: 
     * - the first 4 digits represents the real ID. Where:
     * --the first digit is for (I dont know)
     * --the second one, indicates the semester.
     * --the therth and fourth (I dont know)
     * -The letter at the end (the fifth element) is the initial letter of the
     * -carreer that owns this subject.
     */
    constructor(key) {
        this.key = key;
        this.number = this.key.split('').slice(0, 4).join('');
        this.letter = this.key[4] || null;
        this.conciderLetter = false; /*if is important to consider the letter to
        clasify this subject*/
    }
}

module.exports = Key;