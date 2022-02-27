const getDate = (lang = 'es', addDays = 0, substractDays = 0)=>{
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear();
    if(addDays>0){
        day = day + addDays;
    }
    if(substractDays>0){
        day = day - substractDays;
    }
    if(day<0){
        day = day * Math.sign(day);
        month = month - 1;
    }
    if(lang == 'es'){
        return (month < 10) ? `${day}-0${month}-${year}` : `${day}-${month}-${year}`;
    }else{
        return (month < 10) ? `${year}-0${month}-${day}` : `${year}-${month}-${day}`;
    }
};

const getHourAMPM = () =>{
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
};

const prettyDate = (uglyDate) =>{
    const parts = uglyDate.split('T');
    const dateEng = (parts.length>0) ? parts[0]: getDate();
    return reverseString(dateEng, '-');
}

const dateIsValid = (date) =>{
    let invalidStr = 'Invalid Date';
    return (new Date(date).toString() != invalidStr); 
}

const esperar = async function(time){
    return new Promise((resolve)=>{
        setTimeout(function(){
            resolve(true);
        }, time);
    });
}
