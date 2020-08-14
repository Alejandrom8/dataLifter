exports.arrayToText = arr => {
    return arr.reduce((acumulator, current) => (
        acumulator + current + '\n'
    ), '');
}