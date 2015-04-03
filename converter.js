function CSVtoJSON() {

    var csv = "assets/data/SportClubsForMe_Data.csv";
    var array = CSVToArray(csv);
    var objectArray = [];

    for (var i = 1; i < array.length; i++) {
        objectArray[i - 1] = {};

        for (var j = 0; j < array[0].length && j < array[i].length; j++) {
            var key = array[0][j];

            objectArray[i - 1][key] = array[i][j]
        }
    }

    var json = JSON.stringify(objectArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
}