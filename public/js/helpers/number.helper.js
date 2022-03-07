var randomIntFromInterval = function (min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var getModule10 = function(serie){
    
    if(serie.trim().length>0){
        
        if(!isNaN(serie)){
            
            let sum = 0;
            let mod = 0;
            let result = 0;
            let isPositionPair = false;
            let arr = serie.split('');
            
            const divisor = 10;
            
            arr.forEach(currentNumber => {
                let auxiliar = (isPositionPair) ? 2 : 1;
                let product = currentNumber * auxiliar;
               // console.log(`${currentNumber} * ${auxiliar} = ${product}`); 
                product = (product >= 10) ? product - 9 : product;
                sum += product;
                isPositionPair = !isPositionPair;
            });
            mod = (sum % divisor);
            //console.log(`modulo = ${sum} % ${divisor}`);
           // console.log('----------------------------------------');
            result = (mod == 0) ? mod : divisor - mod; 
           // console.log(`resultado = (${mod} == 0) ? ${divisor} - ${mod} = ${result}`);
            return result;
        }
    }
};