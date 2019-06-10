module.exports = (IMPORTS) => {
    const obj = {
        loadHtml: (url) => {
            return new Promise((resolve, reject) => {
                IMPORTS.afterLoad(url, function (html) {
                    resolve(html);
                });
            });
        },
        ifExits: (arr, newData) => {
            return (
                arr.filter(e => e.numbers === newData.numbers).length > 0 &&
                arr.filter(e => e.date === newData.date).length > 0
            );
        },
        saveData: (params) => {
            for (let i in params.data) {
                let currentHTML = params.data[i],
                    bodyParsed = IMPORTS.parse.parse(currentHTML),
                    blockPast = bodyParsed.querySelectorAll(".game-block"),
                    national = blockPast[2],
                    pega3 = blockPast[3],
                    loto = blockPast[6],
                    quinielaPale = blockPast[4];

                //En el mismo orden que la constante pathsJSONS
                const sections = [national, loto, pega3, quinielaPale];
                const bloque = sections[params.numero];

                if (typeof bloque != "undefined") {

                    let sessionDetails = bloque.querySelector(".session-details"),
                        sessionDetailsText = sessionDetails.rawText,
                        gameScores = quinielaPale.querySelector(".game-scores"),
                        numbers = gameScores.rawText;

                    numbers = numbers.match(/\d+/g).map(n => parseInt(n));
                    sessionDetailsText = sessionDetailsText.trim();

                    let objectNumber = {
                        numbers: JSON.stringify(numbers),
                        date: sessionDetailsText
                    };

                    if (!obj.ifExits(params.jsonData, objectNumber)) {
                        console.log(params.lottery.title + ", Nuevos numeros:");
                        console.log(objectNumber);
                        params.jsonData.push(objectNumber);
                    }

                    IMPORTS.fs.writeFileSync(params.lottery.path, JSON.stringify(params.jsonData), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });

                }
            }
        },
        getRandomNumberBetweenTwoValues: (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        insertRecords: (params) => {
            return new Promise((resolve, reject) => {

                let CONNECTION = params.connection;

                CONNECTION.query(`INSERT INTO ${params.table} (n1, n2, n3, nd) VALUES ('${CONNECTION.escape(params.numbersObj.n1)}', '${CONNECTION.escape(params.numbersObj.n2)}', '${CONNECTION.escape(params.numbersObj.n3)}',${CONNECTION.escape(params.dateSQL)})`,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            console.log("Error insertanto el registro en la fecha: " + params.dateESP);
                        }
                        resolve(true);
                    });
            });
        },
        insertLotoRecords: (params) => {
            return new Promise((resolve, reject) => {

                let CONNECTION = params.connection;

                CONNECTION.query(`INSERT INTO ${params.table} (n1, n2, n3, n4, n5, n6, n7, n8, nd) VALUES ('${CONNECTION.escape(params.numbersObj.n1)}','${CONNECTION.escape(params.numbersObj.n2)}','${CONNECTION.escape(params.numbersObj.n3)}','${CONNECTION.escape(params.numbersObj.n4)}','${CONNECTION.escape(params.numbersObj.n5)}','${CONNECTION.escape(params.numbersObj.n6)}','${CONNECTION.escape(params.numbersObj.n7)}','${CONNECTION.escape(params.numbersObj.n8)}', ${CONNECTION.escape(params.dateSQL)})`,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            console.log("Error insertanto el registro en la fecha: " + params.dateESP);
                        }
                        resolve(true);
                    });
            });
        }
    };

    return obj;
};