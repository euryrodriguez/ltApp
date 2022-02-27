const ifValueExistInArrayOfObject = (array, prop, value) =>{
    let exists = false;
    array.forEach(element => {
        if(element[prop] != 'undefined'){
            if(element[prop] == value){
                exists = true;
            }
        }
    });
    return exists;
};

const getFormDataAsJson = function($form){
    let data = {};
    let arrayOfFields = $($form[0]).serializeArray();
    arrayOfFields.forEach(function(item){
        data[item.name] = (item.value == 'on') ? 1 : item.value;
    });
    return data;
}
const ifJsonIsNotEmpty = (json)=>{
    const values = Object.values(json);
    return (values.length > 0);
};