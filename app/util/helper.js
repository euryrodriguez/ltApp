module.exports = (IMPORTS) => {
    const obj = {
        loadHtml: (url) => {
            return new Promise((resolve, reject) => {
                IMPORTS.afterLoad(url, function (html) {
                    resolve(html);
                });
            });
        },
        ifExits: (arr, newData) => {
            return (
                arr.filter(e => e.numbers === newData.numbers).length > 0 &&
                arr.filter(e => e.date === newData.date).length > 0
            );
        },
        saveData: (data, allData, pathJSON) => {
            for (let i in data) {
                let currentHTML = data[i],
                    bodyParsed = IMPORTS.parse.parse(currentHTML),
                    blockPast = bodyParsed.querySelectorAll(".game-block"),
                    national = blockPast[2];

                if (typeof national != "undefined") {

                    let sessionDetails = national.querySelector(".session-details"),
                        sessionDetailsText = sessionDetails.rawText,
                        gameScores = national.querySelector(".game-scores"),
                        numbers = gameScores.rawText;

                    numbers = numbers.match(/\d+/g).map(n => parseInt(n));
                    sessionDetailsText = sessionDetailsText.trim();

                    let objectNumber = {
                        numbers: JSON.stringify(numbers),
                        date: sessionDetailsText
                    };

                    if (!obj.ifExits(allData, objectNumber)) {
                        allData.push(objectNumber);
                    }

                    IMPORTS.fs.writeFile(pathJSON, JSON.stringify(allData), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });

                }
            }
        }
    };

    return obj;
};