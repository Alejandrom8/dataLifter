/**
 * genRandomNumber.
 * @param {Number} limit - the limit of the num generation, always goes 
 * from 0 to limit. Example: if limit = 20, the range is 0 to 20 and will return
 * a random number inside that range of numbers.
 */
const genRandomNumber = (limit: number) => Math.floor(Math.random() * limit);

/**
 * genRandomKey - generates a random string with hexadecimal values.
 * @param {Number} [size = 6] - the size of the random key.
 */
export const genRandomKey = (size: number = 6) => {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F'],
        digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        elements = [letters, digits],
        key: string = '', 
        randomElementList: any[], 
        generated: number = 0;

    while(generated <= size) {
        randomElementList = elements[genRandomNumber(elements.length)];
        key += randomElementList[genRandomNumber(randomElementList.length)];
        generated++;
    }

    return key;
}