import "bootstrap/dist/css/bootstrap.css"

const UTIL = require("./app/util/util")();
const DATA = require("./app/data/data");
const LENGTH = DATA.length;

let first = [];
let second = [];
let third = [];

let randomFirst = [];
let randomSecond = [];
let randomThird = [];
let loopCounter = 1;

console.log("Total de registros: "+LENGTH);

for (let i = 0; i < LENGTH; i++) {

    let currentElement = DATA[i],
        date = currentElement.date,
        numbers = JSON.parse(currentElement.numbers);

    const A = numbers[0];
    const B = numbers[1];
    const C = numbers[2];

    first.push(A);
    second.push(B);
    third.push(C);

    randomFirst.push(UTIL.getRandomNumberBetweenTwoValues(0, 100));
    randomSecond.push(UTIL.getRandomNumberBetweenTwoValues(0, 100));
    randomThird.push(UTIL.getRandomNumberBetweenTwoValues(0, 100));

    if (loopCounter == LENGTH) {
        UTIL.init(first, second, third, randomFirst, randomSecond, randomThird, LENGTH);
    }

    loopCounter++;
}