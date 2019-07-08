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
                        gameScores = bloque.querySelector(".game-scores"),
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
        },
        getTodayNumbersFromPastYears: (params) => {
            return new Promise((resolve, reject) => {

                let CONNECTION = params.connection;

                CONNECTION.query(`SELECT * FROM ${params.table} WHERE DAYOFMONTH(nd) = ${params.day} AND MONTH(nd) = ${params.month};`,
                    function (error, results, fields) {
                        resolve(results);
                    });
            });
        },
        calc: async (resultSet, mode) => {
            return new Promise((resolve, reject) => {
                let arrN1 = [],
                    arrN2 = [],
                    arrN3 = [],
                    result = [],
                    averageN1 = 0,
                    averageN2 = 0,
                    averageN3 = 0,
                    lengthly = resultSet.length,
                    loopCounter = 1;
                for (let i = 0; i < lengthly; i++) {
                    let n1 = resultSet[i].n1,
                        n2 = resultSet[i].n2,
                        n3 = resultSet[i].n3;

                    arrN1.push(n1);
                    arrN2.push(n2);
                    arrN3.push(n3);

                    averageN1 += parseInt(n1);
                    averageN2 += parseInt(n2);
                    averageN3 += parseInt(n3);

                    if (loopCounter == lengthly) {

                        /* console.log("Promedio numero 1:" + parseInt(averageN1 / lengthly).toString());
                         console.log("Promedio numero 2:" + parseInt(averageN2 / lengthly).toString());
                         console.log("Promedio numero 3:" + parseInt(averageN3 / lengthly).toString());*/

                        obj.applyModule10(arrN1, mode).then((resultArrN1) => {
                            result.push(resultArrN1);
                            obj.applyModule10(arrN2, mode).then((resultArrN2) => {
                                result.push(resultArrN2);
                                obj.applyModule10(arrN3, mode).then((resultArrN3) => {
                                    result.push(resultArrN3);
                                    resolve({
                                        result: result,
                                        average: [
                                            parseInt(averageN1 / lengthly),
                                            parseInt(averageN2 / lengthly),
                                            parseInt(averageN3 / lengthly),
                                        ],
                                        arrNumbers: [
                                            arrN1,
                                            arrN2,
                                            arrN3
                                        ]
                                    });
                                })
                            });
                        });
                    }

                    loopCounter++;
                }
            })
        },
        applyModule10: (arrN, mode) => {
            return new Promise((resolve, reject) => {

                let aux = true,
                    sum = 0,
                    index = 0,
                    finalValue = 0,
                    loopCounter = 1;

                for (let num of arrN) {

                    let product = 0,
                        currentN = parseInt(num);

                    if (aux) {
                        product = currentN * 1;
                        //  console.log("product = " + currentN + " * 1 = " + (currentN * 1));
                    } else {
                        product = currentN * 2;
                        // console.log("product = " + currentN + " * 2 = " + (currentN * 2));
                    }

                    if (product >= 100) {
                        let reduced = obj.reduceNumber(product.toString());
                        sum = sum + reduced;
                        //console.log("El numero " + product + " fue reducido a:" + reduced)
                    } else {
                        sum = sum + product;
                    }

                    aux = !aux;

                    if (loopCounter == arrN.length) {

                        let operator = (mode == 'modulo') ? " % " : " / ",
                            module = (mode == 'modulo') ? (sum % 10) : Math.round((sum / 10));

                        console.log(mode + " : " + sum + operator + 10 + " = " + module);

                        if (module > 0) {
                            let substract = 10 - module;
                            substract = (substract < 0) ? substract * -1 : substract;
                            finalValue = substract;
                        } else {
                            finalValue = module;
                        }
                        resolve(finalValue);
                    }

                    loopCounter++;
                    index++;
                }
            });
        },
        reduceNumber: (number) => {

            let newNumber = 0;

            for (let num of number.split('')) {
                let currentN = parseInt(num);
                newNumber = currentN + newNumber;
            }

            return newNumber;

        },
        getNationalNumbers: (params) => {
            return new Promise((resolve, reject) => {
                let day = parseInt(params.day),
                    values = params.digits,
                    products = [];
                values.forEach((element, index) => {
                    let multiply = 0,
                        currentNumber = parseInt(element);
                    multiply = (day * currentNumber);
                    products.push(multiply);
                    //console.log(currentNumber + " * " + day + " = " + (multiply));
                    if (values.length == (index + 1)) {
                        resolve(obj.iterateMultplicactions(products));
                    }
                });
            });
        },
        iterateMultplicactions: (numbers) => {
            let newNumbers = [];
            for (let i = 0; i < numbers.length; i++) {
                let current = numbers[i].toString();
                console.log("posicion " + i + " sera eliminada del string: " + current);
                newNumbers.push(obj.removeByIndex(current, (i + 1)));
            }
            return newNumbers;
        },
        removeByIndex: (str, index) => {
            if (str.length > 2) {
                if (index == 0) {
                    return str.slice(1)
                } else {
                    return str.slice(0, index - 1) + str.slice(index);
                }
            } else {
                return str;
            }
        },
        getSplitNumberByTwo: (DATE) => {
            return DATE.valueOf().toString().split(/(..)/).filter(function (a) {
                return a !== '';
            });
        },
        getRandom: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        generateRand24H: (LOWER_BOUND, UPPER_BOUND) => {
            setInterval(function () {
                let rand = obj.getRandom(LOWER_BOUND, UPPER_BOUND);
            }, 1000 * 60 * 60 * 24);
        },
        getArrNumberOfDate: (TODAY) => {
            return Number(TODAY).toString().split(/(..)/).filter(function (a) {
                return a !== '';
            });
        },
        getCombinations: async (arrNumbers) => {
            let result = [],
                collection = [];
            arrNumbers.forEach((element, index) => {
                element.forEach((element, i) => {
                    //Se almacenan todos los numeros en esta variable
                    collection.push(parseInt(element));
                    if ((index + 1) == arrNumbers.length) {
                        obj.makeCombinations(collection).then((response) => {
                            result[index] = response;
                        })
                    }
                });
            });
            return result;
        },
        makeCombinations: (collection) => {
            return new Promise((resolve, reject) => {
                let length = collection.length,
                    combinations = [];
                collection.forEach((element, index) => {
                    collection.forEach((current, i) => {
                        if (parseInt(current) != parseInt(element)) {
                            let pair = [element, current], //Crear par de numeros
                                invert = obj.invertPair(pair); //Invertir los numeros
                            if (!obj.ifCombinationExists(pair, combinations)) {
                                if (pair != null) {
                                    combinations.push(pair);
                                }
                            }
                            if (!obj.ifCombinationExists(invert, combinations)) {
                                if (invert != null) {
                                    combinations.push(invert);
                                }
                            }

                        } else {
                            // console.log(current + " es igual que: "+element);
                        }
                    });
                    if ((index + 1) == length) {
                        resolve(combinations);
                    }
                });
            });
        },
        ifCombinationExists: (pair, collection) => {
            let found = false;
            collection.forEach((current, i) => {
                let n1 = current[0],
                    n2 = current[1];
                if (n1 == pair[0] && n2 == pair[1] || n1 == pair[1] && n2 == pair[0]) {
                    /*  console.log("--------------------------------------------------------------------------------------------");
                      console.log("n1: (" + n1 + " == pair[0] :" + pair[0] + ") , (n2: " + n2 + " == pair[1]: " + pair[1] + ")");
                      console.log("n1: (" + n1 + " == pair[1] :" + pair[1] + ") , (n2: " + n2 + " == pair[0]: " + pair[0] + ")");*/
                    found = true;
                } else {
                    //console.log(pair[0] + " y " + pair[1] + " no existen en la coleccion, los elementos actuales son: " + n1 + " y " + n2);
                }
            });
            return found;
        },
        invertPair: (pair) => {
            return [
                pair[0].toString().split('').reverse().join(''),
                pair[1].toString().split('').reverse().join('')
            ];

        }
    };

    return obj;
};