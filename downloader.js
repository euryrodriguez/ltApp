const GLOBAL = require("./global");
const IMPORTS = require("./app/settings/imports");
const HELPER = require("./app/util/helper")(IMPORTS);
const PATHS = IMPORTS.pathsJSONS;
const PATHSARR = Object.values(PATHS);
const READLINE = require('readline');
const RL = READLINE.createInterface(process.stdin, process.stdout);
const MENU = "¿Que lotería quieres descargar? Elige una opción:  \n 0- Loteria Nacional \n 1- Loto Más \n 2- Pega 3 \n 3- Quiniela Pale \n ";

let app = IMPORTS.express(),
    port = 3000,
    urls = [],
    option = {},
    numero = 0,
    params = {},
    jsonData = {};

RL.setPrompt(MENU);
RL.prompt();
RL.on('line', function (line) {
    numero = parseInt(line.trim());
    if (typeof PATHSARR[numero] !== "undefined") {
        option = PATHSARR[line];
        console.log("Lotería Elegida: " + option.title + ", Descargando...");
        download();
    } else {
        process.stdout.write('\033c');
        console.error("Opción Inválida");
        RL.prompt();
    }

}).on('close', function () {
    process.exit(0);
});

let start = new Date("12/31/2019"),
    end = new Date("06/01/2020"),
    loop = new Date(start),
    loopCounter = 0,
    day_as_milliseconds = 86400000,
    diff_in_millisenconds = end - start,
    diff_in_days = diff_in_millisenconds / day_as_milliseconds;

let download = () => {

    if (start < end) {

        while (loop <= end) {

            let currentDateEs = loop.toLocaleDateString("es-ES").replace(/\//g, "-"),
                newDate = loop.setDate(loop.getDate() + 1),
                url = "https://loteriasdominicanas.com/?date=" + currentDateEs;

            loop = new Date(newDate);
            urls.push(url);

            if (loopCounter == diff_in_days) {

                jsonData = require(option.path);

                try {
                    const promises = urls.map(url => IMPORTS.rp(url));
                    Promise.all(promises).then((data) => {
                        params = {
                            data: data,
                            jsonData: jsonData,
                            lottery: option,
                            numero: numero
                        };
                        HELPER.saveData(params);
                        RL.close();
                    });
                } catch (e) {
                    console.log(e)
                }
            }

            loopCounter++;
        }

    } else {
        console.error("Rango de fechas inválido");
    }
};

/*app.listen(port, () => {
    console.log('http://localhost:' + port + ' - listening on port 3000!');
    console.log("Total de registros: " + allDataNational.length);
});

app.get('/', (req, res) => {
    res.send(JSON.stringify(allData));
});*/