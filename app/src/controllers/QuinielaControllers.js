const IMPORTS = require("../../settings/imports");
const CONNECTION = IMPORTS.connection;

class QuinielaControllers{
    constructor(){}
    async getNumbersBetween(from , to){
        let dateFrom = new Date(from);
        let dateTo = new Date(to);
        let invalidStr = 'Invalid Date';
        return new Promise(async (resolve)=>{
            try {
                if(dateFrom.toString() == invalidStr && dateTo.toString() == invalidStr ){
                   resolve({ status : 0, message: 'El formato de las fechas no es correcto!'})
                } 
                const query = `SELECT * FROM quiniela WHERE nd BETWEEN '${from}' AND '${to}';`; 
                console.log(query);
                CONNECTION.query(query,function(err, data){
                    if(err){
                        console.error(err);
                    }
                    resolve(data);
                });       
            } catch (error) {
                console.error(error);
                resolve([]);
            }
        });
    }

    async getNumbersByDate(strDate){
        let dateObject = new Date(strDate);
        let invalidStr = 'Invalid Date';
        return new Promise(async (resolve)=>{
            try {
                if(dateObject.toString() == invalidStr){
                   resolve({ status : 0, message: 'El formato de la fecha no es correcto!'})
                } 
                const query = `SELECT * FROM quiniela WHERE nd = '${strDate}';`; 
                console.log(query);
                CONNECTION.query(query,function(err, data){
                    if(err){
                        console.error(err);
                    }
                    resolve(data);
                });       
            } catch (error) {
                console.error(error);
                resolve([]);
            }
        });
    }
}

module.exports = new QuinielaControllers();