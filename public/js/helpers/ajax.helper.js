async function submitForm(form, formData = 1) {
    if (formData != 1) {
        $.each(form.files, function (i, file) {
            formData.append('file-' + i, file);
        });
    }
   return new Promise((resolve, reject)=>{
    $.ajax({
        url: form.attr('action'),
        method: form.attr('method'),
        data: (formData != 1) ? formData : form.serialize(),
        processData: true,
        success: function (data) {
            let response =  JSON.parse(JSON.stringify(data));
            resolve(response);
        },
        error: function (data) {
            let result = JSON.parse(JSON.stringify(data));
            resolve(result);
            console.log(result);
        },
        beforeSend: function () {
            form.addClass('loading');
        },
        complete: function () {
            form.removeClass('loading');
        }
    });
   })
}
const progressCargando = function(loading){
    const body = document.querySelector('body');
    if(loading){
        body.classList.add('loading');
    }else{
        body.classList.remove('loading');
    }
}
