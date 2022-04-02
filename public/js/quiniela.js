class Quiniela{
    constructor(){
        this.data = [];
        this.to = getDate('en');
        this.from = getDate('en', 0, 15);
        this.validate = new euvalidate();
    }
    datatable(){
        const selfClass = this;
        let list = $('#list-quiniela');
        if(list.length>0){
            if ( $.fn.DataTable.isDataTable('#list-quiniela') ) {
                $('#list-quiniela').DataTable().destroy();
            }
            const $table = list.DataTable( {
                "ajax": {
                    "url":`/quinielas/getNumbers/${selfClass.from}/${selfClass.to}`,
                    "dataSrc": ""
                },
                "order": [[ 0, "desc" ]],
                "responsive": true,
                "autoWidth":true,
                "retrieve": true,
                "processing": true,
                //"stateSave": true,
                'language': {
                    'loadingRecords': '&nbsp;',
                    'emptyTable': 'No hay nada que mostrar.',
                    'processing': 'Cargando...',
                    'zeroRecords':'Ningún regístro asociado.',
                    'paginate': {
                        next: '<i class="fas fa-arrow-right"></i>', // or '→'
                        previous: '<i class="fas fa-arrow-left"></i>' // or '←'
                    }
                } ,
                "initComplete": function( settings, json ) {
                    selfClass.data = json; 
                    selfClass.getMostFrequently(json);
                },
                "columns": [
                    { "data": "id" },
                    {
                        "data": function(data){
                            return (data.n1<10) ? `0${data.n1}` : data.n1;
                        },
                        "className": ""
                        
                    },
                    {
                        "data": function(data){
                            return (data.n2<10) ? `0${data.n2}` : data.n2;
                        },
                        "className": ""
                        
                    },
                    {
                        "data":(data)=>{
                            return (data.n3<10) ? `0${data.n3}` : data.n3;
                        },
                        "className": ""
                    },
                    {
                        "data":(data)=>{
                            let dateObject = new Date(data.nd);
                            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                            let longDate = dateObject.toLocaleDateString("es-ES", options).replace(/\//g, "-");
                            return longDate;
                        },
                        "width":"15%",
                        "className": ""
                    },
                    {
                        "data":(data)=>{
                            return `
                            <a href="#" data-n1="${data.n1}" data-n2="${data.n2}" 
                            data-n3="${data.n3}" class="btn btn-info btn-details" 
                            data-toggle="tooltip" data-placement="top" title="Ver más">
                            <i class="fas fa-angle-down"></i>
                            </a>
                            `;
                        },
                        "width":"15%",
                        "className": "text-center"
                    }
                ]
            });
        }
    }
    async getNumbersHistory(numbers){
        //const url = `/quinielas/getNumbersHistory/{}`;
        
    }
    getMostFrequently(data){
        let numbers = [];
        let counterObject = {};
        const $frequentlyList = $('#frequently-list');
        $frequentlyList.html('');
        data.forEach(element => {
            let n1 = element.n1;
            let n2 = element.n2;
            let n3 = element.n3;
            n1 = (n1 == 0) ? 100 : n1;
            n2 = (n2 == 0) ? 100 : n2;
            n3 = (n3 == 0) ? 100 : n3;
            
            if(counterObject.hasOwnProperty(n1)){
                counterObject[n1]++;
            }else{
                counterObject[n1] = 1;
            }
            if(counterObject.hasOwnProperty(n2)){
                counterObject[n2]++;
            }else{
                counterObject[n2] = 1;
            }
            if(counterObject.hasOwnProperty(n3)){
                counterObject[n3]++;
            }else{
                counterObject[n3] = 1;
            }
        });
        
        for(let number in counterObject){
            let count = counterObject[number];
            if(count >= 3){
                numbers.push(number);
            }
        }
        if(numbers.length>0){
            numbers.forEach(function(number){
                $frequentlyList.append(`<li class="list-group-item">${number} salió ${counterObject[number]} veces</li>`);
            });
        }
    }
    async numbersFromTodayPast(numbers){
        const selfClass = this;
        let n1Str = '';
        let n2Str = '';
        let n3Str = '';
        $(numbers).each(function(i, item){
            let numberObj = (item.length>0) ? item[0] : [];
            console.log(numberObj);
            if(numberObj.n1 != null){
                let n1 = numberObj.n1.toString();
                let n2 = numberObj.n2.toString();
                let n3 = numberObj.n3.toString(); 
                n1Str+=n1;
                n2Str+=n2;
                n3Str+=n3; 
            }      
        }).promise().done(function(){
            let digits = [];
            digits.push(getModule10(n1Str));
            digits.push(getModule10(n2Str));
            digits.push(getModule10(n3Str));
            console.log(digits);
            selfClass.workWithNumbers({
                digits,
                numbers
            });
        });
    }
    workWithNumbers(params){
        const $target = $('#guess-result');
        let result = parseInt(this.calculate());
        console.log(result);
        let reverse = reverseString(result.toString(), '');
        console.log(reverse);
        let numbers = reverse.toString().match(/.{1,2}/g);
        console.log(numbers);
        let combinations = this.combineNumbers(numbers);
        $target.append(JSON.stringify(combinations));
    }
    calculate(){
        const now = new Date();
        const today = now.getDate() -1;
        const month = now.getMonth() + 1;
        const week = 7;
        const months = 12;
        const year = now.getFullYear();
        const days = 365;
        const pi = 3.14;
        let dayAndMonth = (today * pi * year) / months;
        //return (((days * dayAndMonth * month) * week) - (months * (days * today))) / pi;
        return ((today * month  * year * 9999) * pi) / days;
    }
    
    combineNumbers(numbers = []){
        const selfClass = this;
        let combinations = [];
        numbers.forEach(function(a){
            numbers.forEach(function(b){
                if(a != b){
                    let pair = {a, b};
                    if(selfClass.checkIfObjectExist(combinations, pair)){
                        console.log(`Numeros ${a}, ${b} ya estan en el arreglo: `); 
                    }else{
                        combinations.push(pair);
                    }
                }  
            });
        });
        return combinations;
    }
    checkIfObjectExist(arr = [], obj = {}){
        return arr.find(item => item.a == obj.b);
    }
}

const quiniela = new Quiniela();

quiniela.datatable();

document.addEventListener('DOMContentLoaded', function(){
    console.log(quiniela.from);
    console.log(quiniela.to);
    const $quinielaForm = $('#quinielaForm');
    esperar(200).then(function(){
        $('#btn-query').trigger('click');
    });
    
    $('#btn-query').on('click', async function(){
        if(quiniela.validate.validateForm($quinielaForm)){
            const $dateFrom = $('#dateFrom');
            const $dateTo = $('#dateTo');
            const params = {
                from: $dateFrom.val(),
                to: $dateTo.val()
            };
            if(dateIsValid(params.from) && dateIsValid(params.to)){
                if(new Date(params.to) > new Date(params.from)){
                    quiniela.from = params.from;
                    quiniela.to = params.to;
                    quiniela.datatable();
                }else{
                    mostrarMensaje(0, 'La fecha de inicio no puede ser mayor que la fecha final.');
                    $quinielaForm[0].reset();
                }
            }
        }
    });
    
    $(document).on('click', '.btn-details', function(e){
        e.preventDefault();
        const $selector = $(this);
        const $tdParent = $selector.parent('td');
        const $trRowParent = $tdParent.parent('tr');
        const $iconSVG = $selector.find('svg');
        const iconClassDown = 'fa-angle-down';
        const $newTr = $trRowParent.next('.newTr');
        const dataN1 = $selector.data('n1');
        const dataN2 = $selector.data('n2');
        const dataN3 = $selector.data('n3');
        const dataNumbers = {
            n1: parseInt(dataN1),
            n2: parseInt(dataN2),
            n3: parseInt(dataN3)
        };
        const combinations = [
            {  a: dataNumbers.n1, b: dataNumbers.n3 },
            {  a: dataNumbers.n2, b: dataNumbers.n1 },
            {  a: dataNumbers.n3, b: dataNumbers.n2 },
        ];
        console.log(combinations);
        if($iconSVG.hasClass(iconClassDown)){
            $selector.html(`<i class="fas fa-angle-up"></i>`); 
        }else{
            $selector.html(`<i class="fas fa-angle-down"></i>`); 
        }
        
        if($newTr.length>0){
            $newTr.toggleClass('d-none');
        }else{
            quiniela.getNumbersHistory(dataNumbers);
            let newTr = `
            <tr class="newTr">
            <td colspan="6">
            <p class="text-wrap">Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi impedit odio consequuntur? 
            Harum maxime eius quo reiciendis provident quam dicta consequatur dolore cumque eos 
            pariatur inventore voluptate debitis, incidunt maiores!</p>
            </td>
            </tr>
            `;
            $trRowParent.after(newTr);    
        }
        
    });
    
    $('#btn-guess').on('click', async function(){
        let numbers = [];
        let responses = [];
        let date = new Date();
        let year = date.getFullYear() - 1;
        let day = date.getDate();
        let month = date.getMonth() + 1
        day = (day<10) ? `0${day}` : day;
        month = (month<10) ? `0${month}` : month;
        for(let i = 5; i>0; i--){
            let todayPastYear = `${year}-${month}-${day}`;
            const url = `/quinielas/getNumbersByDate/${todayPastYear}`;
            let response = await fetch(url);
            responses.push(response);
            year = year - 1;
        }
        responses.forEach(async function(response, i){
            let json = await response.json();
            numbers.push(json);
            if((i + 1) == responses.length){
                quiniela.numbersFromTodayPast(numbers);
            }
        });      
    });
    
});