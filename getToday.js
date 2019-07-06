const GLOBAL = require("./global");
const IMPORTS = require("./app/settings/imports");
const CONNECTION = IMPORTS.connection;
const TODAY = new Date();
const TODAYSTR = TODAY.toLocaleDateString("es-ES").replace(/\//g, "-");
const TODAYJSONPATH = "./today.json";
const TODAYJSON = require(TODAYJSONPATH);
const ARRTODAYDATE = TODAYSTR.split('-');
const HELPER = require("./app/util/helper")(IMPORTS);

CONNECTION.connect();

let init = async () => {

    let rand = HELPER.getRandom(2, 20),
        numberFromJSON = (typeof TODAYJSON.number !== "undefined") ? TODAYJSON.number : rand,
        dateFromJSON = (typeof TODAYJSON.date !== "undefined") ? TODAYJSON.date : TODAYSTR,
        numberToday = 0;

    let arrNumbersTodayInPairsOfTwo = Number(TODAY).toString().split(/(..)/).filter(function(a){
        return a !== '';
    });

    console.log(arrNumbersTodayInPairsOfTwo);

    //Numero del dia de la fecha convertida a entero

    let dayInDateNumberFormat = parseInt(arrNumbersTodayInPairsOfTwo[2]);

    if (dateFromJSON == TODAYSTR) {
        console.log("Fechas iguales");
        numberToday = numberFromJSON;
    } else {
        numberToday = rand;
        IMPORTS.fs.writeFileSync(TODAYJSONPATH, JSON.stringify({
            "date": TODAYSTR,
            "number": rand
        }), function (err) {
            if (err) {
                return console.error(err);
            }
        });
    }

    await getNationalNumbers(dayInDateNumberFormat);
};

let getNationalNumbers = async (numberToday) => {

    //Query para obtener los numeros de los años anteriores

    let nationalResultSet = await HELPER.getTodayNumbersFromPastYears({
        connection: CONNECTION,
        day: ARRTODAYDATE[0],
        month: ARRTODAYDATE[1],
        table: 'national'
    });

    //Aplicar algoritmo modulo 10 para obtener los digitos

    let digitsN1 = await HELPER.calc(nationalResultSet, 'modulo');

    console.log("Numeros anteriores:");
   // console.log(digitsN1.arrNumbers);
    console.log(nationalResultSet);

    console.log("Promedio:");
    console.log(digitsN1.average);

/*    console.log("Los digitos del algorimo modulo 10 para nacional son:");
    console.log(digitsN1);*/

    //Multiplicar el numero del dia con los digitos obtenidos
    let nationalNumbersAplicandoMod10 = await HELPER.getNationalNumbers({
        digits: digitsN1.result,
        day: numberToday
    });

    console.log("El resultado final con modulo 10 es: ");
    console.log(nationalNumbersAplicandoMod10);

    /***************************** Aplicar division *********************************/

    let digitsN2 = await HELPER.calc(nationalResultSet, 'division');

    console.log("Los digitos aplicando division son:");
    console.log(digitsN2);

    //Multiplicar el numero del dia con los digitos obtenidos
    let nationalNumbersAplicandoDivision = await HELPER.getNationalNumbers({
        digits: digitsN2.result,
        day: numberToday
    });

    console.log("El resultado final con division es: ");
    console.log(nationalNumbersAplicandoDivision);

    /***************************** Aplicar division *********************************/

    console.log("Combinaciones: \n ");
    process.exit();
};

init();