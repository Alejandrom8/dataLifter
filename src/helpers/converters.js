exports.arrayToText = arr => (
    arr.reduce((accumulator, current) => (
        accumulator + current + '\n'
    ), '')
);