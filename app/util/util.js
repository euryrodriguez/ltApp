import * as tf from "@tensorflow/tfjs/dist/index";

module.exports = () => {
    const obj = {
        init: (aTrain, bTrain, cTrain, aRandom, bRandom, cRandom, LENGTH) => {

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
                    const predsYs = predict(aTrain);
                    const e = loss(predsYs, aRandom);
                    errors.push(e.dataSync());
                    return e;
                });
            }
            //#Second
            for (let index = 0; index < numIterations; index++) {
                optimizer.minimize(() => {
                    const predsYs = predict(bTrain);
                    const e = loss(predsYs, bRandom);
                    errors.push(e.dataSync());
                    return e;
                });
            }
            //#Third
            for (let index = 0; index < numIterations; index++) {
                optimizer.minimize(() => {
                    const predsYs = predict(cTrain);
                    const e = loss(predsYs, cRandom);
                    errors.push(e.dataSync());
                    return e;
                });
            }
            //------------------------------------------------------------------------------------------------

            //Hacer Predicciones

           /* console.log(errors[0]);
            console.log(errors[LENGTH - 1]);*/

            //---------------------------------

            const aTest = tf.tensor1d(aTrain);
            const aRtest = tf.tensor1d(aRandom);

            //---------------------------------

            const bTest = tf.tensor1d(bTrain);
            const bRtest = tf.tensor1d(bRandom);

            //---------------------------------

            const cTest = tf.tensor1d(cTrain);
            const cRtest = tf.tensor1d(cRandom);

            const predictionsForA = predict(aTest);
            const errorsA = tf.losses.meanSquaredError(aRtest, predictionsForA);// Error cuadratico medio

            const predictionsForB = predict(bTest);
            const errorsB = tf.losses.meanSquaredError(bRtest, predictionsForB);// Error cuadratico medio

            const predictionsForC = predict(cTest);
            const errorsC = tf.losses.meanSquaredError(cRtest, predictionsForC);// Error cuadratico medio

            //console.log("El error cuadratico medio es " + errorsA);
            //console.log("Peso1:"+ m);
            //console.log("Sesgo1:"+ b);

            console.log("Predicciones A: " + predictionsForA);
            console.log("Predicciones B: " + predictionsForB);
            console.log("Predicciones C: " + predictionsForC);
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
        }
    };
    return obj;
};