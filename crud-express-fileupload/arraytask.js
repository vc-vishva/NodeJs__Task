const array1 = [1, 2, 3, 6, 7, 8, 23];
const array2 = [2, 3, 4, 5, 11, 24, 56];

// Intersection 
const intersection = array1.filter(element => array2.includes(element));
console.log('Intersection:', intersection);
//
//not belong to the intersection 
const notInIntersection = [...array1, ...array2].filter(element => !(array1.includes(element) && array2.includes(element)));
console.log('Not in Intersection:', notInIntersection);

// array2 and not array1
const onlyInArray2 = array2.filter(element => !array1.includes(element));
console.log('Only in Array2:', onlyInArray2);
