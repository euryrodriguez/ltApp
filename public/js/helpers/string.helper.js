const reverseString = (string, separator)=>{
    if(separator == 'undefined'){
        console.error('reverseString missing separator.');
    }
    return string.split(separator).reverse().join(separator);
}
const ifNotUndefined = (obj, prop) =>{
    return (obj.hasOwnProperty(prop)); 
}

const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    return result;
}