class Quiniela{
    constructor(){
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
                            return prettyDate(data.nd);
                        },
                        "width":"15%",
                        "className": ""
                    }
                ]
            });
        }
    }
    async getNumbersFromTo(from, to){
        const url = `/quinielas/getNumbers/${from}/${to}`;
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
});