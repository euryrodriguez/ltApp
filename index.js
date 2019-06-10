import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap"
import "babel-polyfill";
import "datatables.net-dt/css/jquery.dataTables.min.css"
import "font-awesome/css/font-awesome.min.css"
import "ladda/dist/ladda.min.css"
import * as Ladda from 'ladda';


//Init Jquery
const jquery = require("jquery");
window.$ = window.jQuery = jquery;
window.$.fn.init();
const $ = window.$;

//JQuery Datatable
const dt = require('datatables.net')();


const UTIL = require("./app/util/util")();
const DATA = require("./app/data/national");
const LENGTH = DATA.length;
const TWENTYPERCENT = parseInt(LENGTH * 0.20); //20 porciento de los registros

//console.log("20%: "+TWENTYPERCENT);

let loopCounter = 1;
let xTrain = [];
let yTrain = [];
let allData = [];

console.log("Total de registros: " + LENGTH);

for (let i = 0; i < (LENGTH - TWENTYPERCENT); i++) {

    let currentElement = DATA[i],
        date = currentElement.date,
        numbers = JSON.parse(currentElement.numbers);

    const A = numbers[0];
    const B = numbers[1];
    const C = numbers[2];

    xTrain[i] = [A, B];
    yTrain[i] =  [
        UTIL.getRandomNumberBetweenTwoValues(0, 100),
        UTIL.getRandomNumberBetweenTwoValues(0, 100)
    ];
    /*  const yTrainArr = [
          UTIL.getRandomNumberBetweenTwoValues(0, 100),
          UTIL.getRandomNumberBetweenTwoValues(0, 100),
          UTIL.getRandomNumberBetweenTwoValues(0, 100)
      ];

      yTrain.push(yTrainArr);*/

    if (loopCounter == LENGTH) {
        //$('#calculate').removeClass('disabled');
    }

    loopCounter++;
}

for (let i = 0; i < LENGTH; i++) {

    let currentElement = DATA[i],
        date = currentElement.date,
        numbers = JSON.parse(currentElement.numbers);

    const A = numbers[0];
    const B = numbers[1];
    const C = numbers[2];

    allData.push([A, B]);
}

let count = 1;

$(document).ready(function () {

    const oTable = $('#list');

    UTIL.getDataTableData(DATA, LENGTH).then(collection => {
        oTable.DataTable({
            data: collection,
            columns: [
                {data: 'count'},
                {data: 'first'},
                {data: 'second'},
                {data: 'third'},
                {data: 'date'}
            ],
            "order": [[0, "desc"]]
        });
    });

    const modal = $('#modalSuccess'),
        calculateButton = $('#calculate');

    calculateButton.on('click', (e) => {

        e.preventDefault();

        let params = {
                days: parseInt($('#days').val()),
                activation: $('#activation').val(),
                learningRate: parseFloat($('#learningRate').val()),
                iterations: parseInt($('#iterations').val()),
                xTrain: xTrain,
                yTrain: yTrain,
                allData: allData,
                twPercent: TWENTYPERCENT
            },
            button = UTIL.initProcess(calculateButton[0]);

        setTimeout(() => {
            UTIL.calculate(params).then((predictions) => {
                console.log(predictions.argMax().dataSync());
                $('#result').html("<br>" + UTIL.getListOfNumbers(predictions.argMax().dataSync()));
                UTIL.openSuccessModal(modal, predictions.argMax().dataSync());
                button.stop();
            });
        }, 3000);
    });

    const updateTableButton = $('#update-table');

    updateTableButton.on('click', (e) => {
        e.preventDefault();

    });

});