const getCountRowsTable = (tableId) =>{
    try {
        const table = document.querySelector(tableId);
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        return (rows != null) ? rows.length : 0;
    } catch (error) {
        return 0;
    }
}
const printElem = (elem)=>{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    return true;
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const getCurrentLocationUrl = ()=>{
    return window.location.href;
}