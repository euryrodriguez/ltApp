import * as tf from "@tensorflow/tfjs/dist/index";
import * as brain from "brain.js"
import * as Ladda from "ladda/js/ladda";

module.exports = () => {
    const obj = {
        calculate: (params) => {
            return new Promise((resolve, reject) => {

                //Formula: h(x) = B0 + B1 * CGPA

                //Construir nuestro modelo
                const m = tf.variable(tf.scalar(Math.random())); // B1  Peso
                const b = tf.variable(tf.scalar(Math.random())); // B0  Bias(sesgo)

                //console.log("Peso 1:"+ m);
                //console.log("Sesgo 1:"+ b);

                //Crear funcion predict

                function predict(x) {
                    return tf.tidy(() => {
                        return m.mul(x).add(b);
                    });
                }

                //Entrenamiento

                function loss(predictions, labels) {
                    return predictions.sub(labels).square().mean();
                }

                //Tasa de aprendizaje

                const learningRate = 0.0001;
                const optimizer = tf.train.sgd(learningRate);

                const numIterations = 1000;
                const errors = [];

                //Ciclo de optimizacion -------------------------------------------------------------------------

                //#First
                for (let index = 0; index < numIterations; index++) {
                    optimizer.minimize(() => {
                        const predsYs = predict(params.xTrain);
                        const e = loss(predsYs, params.yTrain);
                        errors.push(e.dataSync());
                        return e;
                    });
                }
                //------------------------------------------------------------------------------------------------

                //Hacer Predicciones

                /* console.log(errors[0]);
                 console.log(errors[LENGTH - 1]);*/

                //---------------------------------

                const aTest = tf.tensor(params.xTrain, null, "int32");
                const aRtest = tf.tensor(params.yTrain, null, "int32");

                const tryNumbers = obj.getLastNumbers(params.twPercent, params.allData);
                const testTensor = tf.tensor(tryNumbers, null, "int32");

                const predictions = predict(aTest);
                const errorsA = tf.losses.meanSquaredError(aRtest, predictions);// Error cuadratico medio

                console.log("Predicciones:");
                console.log(predictions.dataSync());
                //console.log("El error cuadratico medio es " + errorsA);
                //console.log("Peso1:"+ m);
                //console.log("Sesgo1:"+ b);
                resolve(predictions);
            });
        },
        predict: (x, m, b) => {
            return tf.tidy(() => {
                return m.mul(x).add(b);
            });
        },
        loss: (predictions, labels) => {
            return predictions.sub(labels).square().mean();
        },
        getRandomNumberBetweenTwoValues: (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        intento: async (modelo, x1, x2) => {
            for (let i = 0; i < 100; i++) {
                let respuesta = await modelo.fit(x1, x2, {shuffle: true, epochs: 100});
                console.log(respuesta.history.loss[0]); //imprimir perdida
            }
        },
        toggleClass: (selector, className) => {
            if (selector.hasClass(className)) {
                selector.removeClass(className);
            } else {
                selector.addClass(className);
            }
        },
        addClass: (selector, className) => {
            if (!selector.hasClass(className)) {
                selector.addClass(className);
            }
        },
        removeClass: (selector, className) => {
            if (selector.hasClass(className)) {
                selector.removeClass(className);
            }
        },
        generateNextDayPrediction: (data, timePortion) => {
            let size = data.length;
            let features = [];

            for (let i = (size - timePortion); i < size; i++) {
                features.push(data[i]);
            }
            return features;
        },
        minMaxScaler: (data, min, max) => {
            let scaledData = data.map(function (value) {
                return (value - min) / (max - min);
            });

            return {
                data: scaledData,
                min: min,
                max: max
            }
        },
        minMaxInverseScaler: (data, min, max) => {

            let scaledData = data.map(function (value) {
                return value * (max - min) + min;
            });

            return {
                data: scaledData,
                min: min,
                max: max
            }
        },
        getMin: (data) => {
            return Math.min(...data);
        },
        getMax: (data) => {
            return Math.max(...data);
        },
        getLastNumbers(days, data) {
            let collection = [],
                lengthly = data.length,
                subtraction = (lengthly - days);
            for (let i = subtraction; i < lengthly; i++) {
                let currentElement = data[i];
                collection.push(currentElement);
            }
            return collection;
        },
        getDataTableData: (data, length) => {
            return new Promise((resolve, reject) => {

                let count = 1,
                    allData = [],
                    loopCounter = 1;

                for (let i = 0; i < length; i++) {

                    let currentElement = data[i],
                        date = currentElement.date,
                        numbers = JSON.parse(currentElement.numbers),
                        record = {
                            count: count,
                            first: numbers[0],
                            second: numbers[1],
                            third: numbers[2],
                            date: date
                        };

                    allData.push(record);

                    if (count == loopCounter) {
                        resolve(allData);
                    }

                    count++;
                    loopCounter++;
                }
            });
        },
        initProcess: (querySelector) => {

            // Create a new instance of ladda for the specified button
            const button = Ladda.create(querySelector);

            // Start loading
            button.start();

            // Will display a progress bar for 50% of the button width
            button.setProgress(0.5);

            return button;
        },
        openSuccessModal: (modal, content) => {
            let html = obj.getListOfNumbers(content);
            modal.find('.modal-body').html(html);
            modal.modal('show');
        },
        getListOfNumbers: (numbersArr) => {
            let html = `<ul class="list-group list-group-horizontal">`;
            for (let index = 0; index < numbersArr[0].length; index++) {
                html += `<li class="list-group-item">${numbersArr[0][index]}</li>`;
            }
            html += `</ul>`;
            return html;
        }
    };

    return obj;
};