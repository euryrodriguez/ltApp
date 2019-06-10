const GLOBAL = require("./global");
const IMPORTS = require("./app/settings/imports");
const CONNECTION = IMPORTS.connection;
const LOTO = require(IMPORTS.pathsJSONS.loto.path);
const PEGA3 = require(IMPORTS.pathsJSONS.pega3.path);
const QUINIELA = require(IMPORTS.pathsJSONS.quiniela.path);
const NATIONAL = require(IMPORTS.pathsJSONS.national.path);
const HELPER = require("./app/util/helper")(IMPORTS);

let table = '';
let lotoPromises = [];
let pega3Promises = [];
let nationalPromises = [];
let quinielaPromises = [];

CONNECTION.connect();

table = 'superlotomas';

CONNECTION.query(`TRUNCATE TABLE '${table}';`,
    function (error, results, fields) {

    });

for (let i = 0; i < LOTO.length; i++) {

    let current = LOTO[i],
        numbers = JSON.parse(current.numbers),
        dateESP = current.date,
        dateENG = dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2) + "-" + dateESP.substr(6, 4),
        dateSQL = dateESP.substr(6, 4) + "-" + dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2),
        numbersObj = {
            n1: (typeof numbers[0] != "undefined") ? numbers[0] : 0,
            n2: (typeof numbers[1] != "undefined") ? numbers[1] : 0,
            n3: (typeof numbers[2] != "undefined") ? numbers[2] : 0,
            n4: (typeof numbers[3] != "undefined") ? numbers[3] : 0,
            n5: (typeof numbers[4] != "undefined") ? numbers[4] : 0,
            n6: (typeof numbers[5] != "undefined") ? numbers[5] : 0,
            n7: (typeof numbers[6] != "undefined") ? numbers[6] : 0,
            n8: (typeof numbers[7] != "undefined") ? numbers[7] : 0,
        },
        params = {
            table: table,
            connection: CONNECTION,
            numbersObj: numbersObj,
            dateSQL: dateSQL,
            dateESP: dateESP
        };

    lotoPromises.push(HELPER.insertLotoRecords(params));

    if (LOTO.length == (i + 1)) {
        console.log("Insertar loto mas, Procesando...");
        Promise.all(lotoPromises)
            .then(() => {
                console.log("Se insertaron los registros del loto mas.");
            })
            .catch((e) => {
                // handle errors here
            });
    }
}

/*************************************************************************************/

table = 'pega3mas';

CONNECTION.query(`TRUNCATE TABLE '${table}';`,
    function (error, results, fields) {

    });

for (let i = 0; i < PEGA3.length; i++) {

    let current = PEGA3[i],
        numbers = JSON.parse(current.numbers),
        dateESP = current.date,
        dateENG = dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2) + "-" + dateESP.substr(6, 4),
        dateSQL = dateESP.substr(6, 4) + "-" + dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2),
        numbersObj = {
            n1: (typeof numbers[0] != "undefined") ? numbers[0] : 0,
            n2: (typeof numbers[1] != "undefined") ? numbers[1] : 0,
            n3: (typeof numbers[2] != "undefined") ? numbers[2] : 0
        },
        params = {
            table: table,
            connection: CONNECTION,
            numbersObj: numbersObj,
            dateSQL: dateSQL,
            dateESP: dateESP
        };

    pega3Promises.push(HELPER.insertRecords(params));

    if (PEGA3.length == (i + 1)) {
        console.log("Insertar Pega 3, Procesando...");
        Promise.all(pega3Promises)
            .then(() => {
                console.log("Se insertaron los registros del Pega3");
            })
            .catch((e) => {
                // handle errors here
            });
    }
}


/**************************************************************************************/

table = 'quiniela';

CONNECTION.query(`TRUNCATE TABLE '${table}';`,
    function (error, results, fields) {

    });

for (let i = 0; i < QUINIELA.length; i++) {

    let current = QUINIELA[i],
        numbers = JSON.parse(current.numbers),
        dateESP = current.date,
        dateENG = dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2) + "-" + dateESP.substr(6, 4),
        dateSQL = dateESP.substr(6, 4) + "-" + dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2),
        numbersObj = {
            n1: (typeof numbers[0] != "undefined") ? numbers[0] : 0,
            n2: (typeof numbers[1] != "undefined") ? numbers[1] : 0,
            n3: (typeof numbers[2] != "undefined") ? numbers[2] : 0
        },
        params = {
            table: table,
            connection: CONNECTION,
            numbersObj: numbersObj,
            dateSQL: dateSQL,
            dateESP: dateESP
        };

    quinielaPromises.push(HELPER.insertRecords(params));

    if (QUINIELA.length == (i + 1)) {
        console.log("Insertar Quiniela Pale, Procesando...");
        Promise.all(quinielaPromises)
            .then(() => {
                console.log("Se insertaron los registros de la Quiniela Pale.");
            })
            .catch((e) => {
                // handle errors here
            });
    }
}
/**************************************************************************************/

table = 'national';

CONNECTION.query(`TRUNCATE TABLE '${table}';`,
    function (error, results, fields) {

    });

for (let i = 0; i < NATIONAL.length; i++) {

    let current = NATIONAL[i],
        numbers = JSON.parse(current.numbers),
        dateESP = current.date,
        dateENG = dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2) + "-" + dateESP.substr(6, 4),
        dateSQL = dateESP.substr(6, 4) + "-" + dateESP.substr(3, 2) + "-" + dateESP.substr(0, 2),
        numbersObj = {
            n1: (typeof numbers[0] != "undefined") ? numbers[0] : 0,
            n2: (typeof numbers[1] != "undefined") ? numbers[1] : 0,
            n3: (typeof numbers[2] != "undefined") ? numbers[2] : 0
        },
        params = {
            table: table,
            connection: CONNECTION,
            numbersObj: numbersObj,
            dateSQL: dateSQL,
            dateESP: dateESP
        };

    nationalPromises.push(HELPER.insertRecords(params));

    if (NATIONAL.length == (i + 1)) {
        console.log("Insertar Loteria Nacional, Procesando...");
        Promise.all(nationalPromises)
            .then(() => {
                console.log("Se insertaron los registros de la Loteria Nacional.");
            })
            .catch((e) => {
                // handle errors here
            });
    }
}

/**************************************************************************************/
CONNECTION.end();