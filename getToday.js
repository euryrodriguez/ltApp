const GLOBAL = require("./global");
const IMPORTS = require("./app/settings/imports");
const CONNECTION = IMPORTS.connection;
const TODAY = new Date();
const TODAYSTR = TODAY.toLocaleDateString("es-ES").replace(/\//g, "-");
const ARRTODAYDATE = TODAYSTR.split('-');
const HELPER = require("./app/util/helper")(IMPORTS);

CONNECTION.connect();

let init = async () => {

    //Number(TODAY) Esto convierte la fecha a entero

    let arrNumbersTodayInPairsOfTwo = Number(TODAY).toString().split(/(..)/).filter(function(a){
        return a !== '';
    });

    //Numero del dia de la fecha convertida a entero

    let dayInDateNumberFormat = parseInt(arrNumbersTodayInPairsOfTwo[2]);

    //Query para obtener los numeros de los años anteriores
    let nationalResultSet = await HELPER.getTodayNumbersFromPastYears({
        connection: CONNECTION,
        day: ARRTODAYDATE[0],
        month: ARRTODAYDATE[1],
        table:'national'
    });

    let paleResultSet = await HELPER.getTodayNumbersFromPastYears({
        connection: CONNECTION,
        day: ARRTODAYDATE[0],
        month: ARRTODAYDATE[1],
        table:'quiniela'
    });

    console.log("Numeros anteriores de la nacional:");
    console.log(nationalResultSet);

    console.log("Numeros anteriores de la quiniela pale:");
    console.log(paleResultSet);

    //Aplicar algoritmo modulo 10 para obtener los digitos

    let digitsNationalToday = await HELPER.calc(nationalResultSet);
    let digitsPaleToday = await HELPER.calc(paleResultSet);

    console.log("Los digitos del algorimo para nacional son:");
    console.log(digitsNationalToday);
    console.log("Los digitos del algorimo para pale son:");
    console.log(digitsPaleToday);

    //Multiplicar el numero del dia con los digitos obtenidos
    let nationalNumbers = await HELPER.getNationalAndPaleNumbers({
        digits: digitsNationalToday,
        day:dayInDateNumberFormat
    });

    let paleNumbers = await HELPER.getNationalAndPaleNumbers({
        digits: digitsPaleToday,
        day:dayInDateNumberFormat
    });

    console.log("EL resultado final nacional es: ");
    console.log(nationalNumbers);

    console.log("EL resultado final pale es: ");
    console.log(paleNumbers);
};

init();