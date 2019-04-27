const IMPORTS = require("./app/settings/imports");
const HELPER = require("./app/util/helper")(IMPORTS);

let pathJSON = "./app/data/data.json",
    afterLoad = IMPORTS.afterLoad,
    parse = IMPORTS.parse,
    fs = IMPORTS.fs,
    rp = IMPORTS.rp,
    app = IMPORTS.express(),
    port = 3000,
    urls = [],
    allData = require(pathJSON);

app.get('/', (req, res) => {

    let start = new Date("01/02/2019"),
        end = new Date("04/26/2019"),
        loop = new Date(start),
        loopCounter = 0,
        day_as_milliseconds = 86400000,
        diff_in_millisenconds = end - start,
        diff_in_days = diff_in_millisenconds / day_as_milliseconds;

    while (loop <= end) {

        let currentDateEs = loop.toLocaleDateString("es-ES").replace(/\//g, "-"),
            newDate = loop.setDate(loop.getDate() + 1),
            url = "https://loteriasdominicanas.com/?date=" + currentDateEs;

        loop = new Date(newDate);
        urls.push(url);

        if (loopCounter == diff_in_days) {
            try {
                const promises = urls.map(url => IMPORTS.rp(url));
                Promise.all(promises).then((data) => {
                    HELPER.saveData(data, allData, pathJSON);
                });
            }catch (e) {
                console.log(e)
            }
        }

        loopCounter++;
    }
    res.send(JSON.stringify(allData));
});

app.listen(port, () => {
    console.log('http://localhost:' + port + ' - listening on port 3000!');
    console.log("Total de registros: "+allData.length);
});

