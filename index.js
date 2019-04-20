import "bootstrap/dist/css/bootstrap.css"
import * as tf from "@tensorflow/tfjs"
document.getElementById("hola").innerHTML="Hola";

const Xtrain = [78, 70.6, 70, 74.64, 73.9, 76.32, 72.68, 8.58, 85.03, 78, 74.9, 72.29, 60, 60, 67.67, 63, 64];
const Ytrain = [7855, 7359, 7705, 8347, 8619, 7356, 1587, 8854, 8013, 8053, 7681, 6988, 6150, 6878, 6433, 6333, 6433];

//Formula: h(x) = B0 + B1 * CGPA

//Construir nuestro modelo
const m = tf.variable(tf.scalar(Math.random())); // B1  Peso
const b = tf.variable(tf.scalar(Math.random())); // B0  Bias(sesgo)

//console.log("Peso 1:"+ m);
//console.log("Sesgo 1:"+ b);


//Crear funcion predict

function predict(x){
    return tf.tidy(()=>{
        return m.mul(x).add(b);
    });
}

//Entrenamiento

function loss(predictions, labels){
    return predictions.sub(labels).square().mean();
}

//Tasa de aprendizaje

const learningRate = 0.0001;
const optimizer = tf.train.sgd(learningRate);

const numIterations = 1000;
const errors = [];

//Ciclo de optimizacion

for (let index = 0; index < numIterations; index++) {
    optimizer.minimize(()=>{
        const predsYs = predict(Xtrain);
        const e = loss(predsYs, Ytrain);
        errors.push(e.dataSync());
        return e;
    });
}

//Hacer Predicciones

console.log(errors[0]);
console.log(errors[numIterations - 1]);

const Xtest = tf.tensor1d([78, 70.6, 70, 74.64, 73.9, 76.32, 72.68, 8.58, 85.03, 78, 74.9, 72.29, 60, 60, 67.67, 63, 64]);
const Ytest = tf.tensor1d([7855, 7359, 7705, 8347, 8619, 7356, 1587, 8854, 8013, 8053, 7681, 6988, 6150, 6878, 6433, 6333, 6433]);
//un Resultado [7682.3398438, 6961.8051758, 6903.3837891, 7355.1782227, 7283.125, 7518.7587891, 7164.3339844, 922.9473877, 8366.8466797, 7682.3398438, 7380.4946289, 7126.3598633, 5929.6884766, 5929.6884766, 6676.5126953, 6221.796875, 6319.1665039]
const predictions = predict(Xtest);
var error = tf.losses.meanSquaredError(Ytest, predictions);// Error cuadratico medio

console.log("El error cuadratico medio es "+ error);
//console.log("Peso1:"+ m);
//console.log("Sesgo1:"+ b);

console.log("Predicciones: "+predictions);