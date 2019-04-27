import "bootstrap/dist/css/bootstrap.css"
const jquery = require("jquery");

//Init Jquery
window.$ = window.jQuery = jquery;
window.$.fn.init();
const $ = window.$;

const UTIL = require("./app/util/util")();
const DATA = require("./app/data/data");
const LENGTH = DATA.length;

let loopCounter = 1;
let xTrain = [];
let yTrain = [];

console.log("Total de registros: " + LENGTH);

for (let i = 0; i < LENGTH; i++) {

    let currentElement = DATA[i],
        date = currentElement.date,
        numbers = JSON.parse(currentElement.numbers);

    xTrain.push(numbers);

    const A = numbers[0];
    const B = numbers[1];
    const C = numbers[2];

    const yTrainArr = [UTIL.getRandomNumberBetweenTwoValues(0, 100), UTIL.getRandomNumberBetweenTwoValues(0, 100), UTIL.getRandomNumberBetweenTwoValues(0, 100)];

    yTrain.push(yTrainArr);

    if (loopCounter == LENGTH) {
        //UTIL.calculate(xTrain, yTrain);
    }

    loopCounter++;
}

let count = 1;

$(document).ready(function () {

    const oTable = $('#list');

    for (let i = 0; i < LENGTH; i++) {
        let currentElement = DATA[i],
            date = currentElement.date,
            numbers = JSON.parse(currentElement.numbers),
            html = `<tr>
                    <td>${count}</td>
                    <td>${numbers[0]}</td>
                    <td>${numbers[1]}</td>
                    <td>${numbers[2]}</td>
                    <td>${date}</td>
                   </tr>`;
        oTable.find('tbody').append(html);
        count++;
    }
});