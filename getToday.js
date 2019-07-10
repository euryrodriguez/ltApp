const GLOBAL = require("./global");
const IMPORTS = require("./app/settings/imports");
const CONNECTION = IMPORTS.connection;
const TODAY = new Date();
const TODAYSTR = TODAY.toLocaleDateString("es-ES").replace(/\//g, "-");
const TIMESTR = TODAY.toLocaleTimeString();
//const TIMESTR = TODAY.getHours() + ":" + TODAY.getMinutes();
const TODAYJSONPATH = "./today.json";
const TODAYJSON = require(TODAYJSONPATH);
const ARRTODAYDATE = TODAYSTR.split('-');
const HELPER = require("./app/util/helper")(IMPORTS);

CONNECTION.connect();

let init = async () => {

    let rand = HELPER.getRandom(2, 22);

    rand = (rand < 10) ? rand * 5 : rand;

    let numberFromJSON = (typeof TODAYJSON.number !== "undefined") ? TODAYJSON.number : rand,
        dateFromJSON = (typeof TODAYJSON.date !== "undefined") ? TODAYJSON.date : TODAYSTR,
        numberToday = 0;

    if (dateFromJSON == TODAYSTR) {
        console.log("Fechas iguales");
        numberToday = numberFromJSON;
        console.log("Numero aleatorio del dia: "+numberToday);
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

    let arrNumbers = HELPER.getArrNumberOfDate(TODAY),
        numberTodayForNow = parseInt(arrNumbers[2]);
    console.log(arrNumbers);
    await getNationalNumbers(numberTodayForNow);

};

let getNationalNumbers = async (numberToday) => {

    //Query para obtener los numeros de los años anteriores

    let nationalResultSet = await HELPER.getTodayNumbersFromPastYears({
        connection: CONNECTION,
        day: ARRTODAYDATE[0],
        month: ARRTODAYDATE[1],
        table: 'national'
    });

    console.log("Numeros anteriores:");
    console.log(nationalResultSet);

    //Aplicar algoritmo modulo 10 para obtener los digitos

    let digitsN1 = await HELPER.calc(nationalResultSet, 'modulo');

    console.log("Los digitos del algorimo modulo 10 son:");
    console.log(digitsN1.result);

    console.log("Promedio de los numeros anteriores:");
    console.log(digitsN1.average);

    //Multiplicar el numero del dia con los digitos obtenidos
    let nationalNumbersMod10 = await HELPER.getNationalNumbers({
        digits: digitsN1.result,
        day: numberToday
    });

    console.log("El resultado final con modulo 10 es: ");
    console.log(nationalNumbersMod10);

    /***************************** Aplicar division *********************************/

    let digitsN2 = await HELPER.calc(nationalResultSet, 'division');

    console.log("Los digitos aplicando division son:");
    console.log(digitsN2);

    //Multiplicar el numero del dia con los digitos obtenidos
    let nationalNumbersDivision = await HELPER.getNationalNumbers({
        digits: digitsN2.result,
        day: numberToday
    });

    console.log("El resultado final con division es: ");
    console.log(nationalNumbersDivision);

    /***************************** Aplicar division *********************************/
    let combinationsJSON = require("./combinations.json"),
        dateFromJSON = combinationsJSON.date,
        dataFromJSON = (typeof combinationsJSON.data == "string") ? JSON.parse(combinationsJSON.data) : combinationsJSON.data,
        pairFromDATA = dataFromJSON[dataFromJSON.length - 1].pairs,
        combinations = await HELPER.getCombinations([
            //  digitsN1.average,
            // nationalNumbersMod10,
            //     digitsN2.result,
            //   digitsN2.average,
            nationalNumbersDivision
        ]);

    console.log("Combinaciones: \n ");
    console.log("**********************************************");

    let counter = 0;

    combinations.forEach((currentSet, index) => {
        if (Array.isArray(currentSet)) {
            currentSet.forEach((element, i) => {
                counter++;
            });
        }
    });

    console.log("El conteo de las combinaciones es: " + counter);

    let parsed = JSON.parse(pairFromDATA),
        array1 = parsed[0],
        array2 = combinations[0];

    if (dateFromJSON == TODAYSTR) {

        if (!array1.equals(array2)) {

            dataFromJSON.push({
                "pairs": JSON.stringify(combinations),
                "hour": TIMESTR
            });

            let objectToSave = {
                "date": TODAYSTR,
                "data": JSON.stringify(dataFromJSON)
            };

            console.log("Nuevas combinaciones: \n");

            dataFromJSON.map(e => console.log(e));

            IMPORTS.fs.writeFileSync("./combinations.json", JSON.stringify(objectToSave),
                function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });

            process.exit();

        } else {
            console.log("No hay cambios \n");
            console.log("Combinaciones actuales: \n");
            dataFromJSON.map(e => console.log(e));
            process.exit();
        }
    } else {

        let objectToSave = {
            "date": TODAYSTR,
            "data": [
                {
                    "pairs": JSON.stringify(combinations),
                    "hour": TIMESTR
                }
            ]
        };

        IMPORTS.fs.writeFileSync("./combinations.json", JSON.stringify(objectToSave),
            function (err) {
                if (err) {
                    return console.error(err);
                }
            });

        console.log("Combinaciones actuales: \n");
        dataFromJSON.map(e => console.log(e));
        process.exit();
    }
};

init();