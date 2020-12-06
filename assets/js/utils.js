// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)){
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        var strMatchedValue;
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]){
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
                );
        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push( strMatchedValue );
    }
    // Return the parsed data.
    return(arrData);
}

function contentDisplay(className) {
    var x = document.getElementsByClassName(className);
    for (let i = 0; i < x.length; i++) {
        if (x[i].style.display === "none") {
            x[i].style.display = "table-row";
          } else {
            x[i].style.display = "none";
          }
    }
}

function arrayToTablePartial(data) {
    var html = "";
    var heads = ["Confirmed", "Deaths", "Recovered", "Active"];
    var indices = [7, 8, 9, 10, 11];
    if (data[0].constructor === Array) {
        // Generate the table head
        html += '<table class="center\r\n">';
        html += '<tr class="table">\r\n';
        for (var item in data[0]) {
            if (heads.includes(data[0][item])) {
                html += "<th>" + data[0][item] + "</th>\r\n";
            }
            if (data[0][item] == "Combined_Key") {
                html += "<th>" + "Region" + "</th>\r\n";
            }
        }
        html += "</tr>\r\n";
        data.slice(1, 10).forEach(createRows);
        function createRows(row) {
            html += '<tr class="table">\r\n';
            row.forEach(createCells);
            html += "</tr>\r\n";
        }
        function createCells(item, index) {
            if (indices.includes(index)) {
                html += "<td>" + item + "</td>\r\n";
            }
        }
        html += "</table>";
    }
    return html;
}

// build HTML table data from an array (one or two dimensional)
function arrayToTableComplete(data) {
    var html = "";
    var heads = ["Confirmed", "Deaths", "Recovered", "Active"];
    var indices = [7, 8, 9, 10, 11];
    if (data[0].constructor === Array) {
        // Generate the table head

        html += '<div class="table-responsive">\r\n';
        html += '<table class="table table-striped">\r\n';
        html += '<thead class="thead-dark">\r\n';
        html += '<tr>\r\n';
        for (var item in data[0]) {
            if (heads.includes(data[0][item])) {
                html += "<th>" + data[0][item] + "</th>\r\n";
            }
            if (data[0][item] == "Combined_Key") {
                html += "<th>" + "Region" + "</th>\r\n";
            }
        }
        html += "</tr>\r\n";
        html += "</thead>\r\n";
        html += "<tbody>\r\n";
        data.slice(1, 10).forEach(createRows);
        // Hide the rest of the table
        data.slice(10).forEach(createRowsNoDisplay);
        function createRows(row) {
            html += '<tr>\r\n';
            row.forEach(createCells);
            html += "</tr>\r\n";
        }
        function createRowsNoDisplay(row) {
            html += '<tr class="table-hide" style="display:none">\r\n';
            row.forEach(createCells);
            html += "</tr>\r\n";
        }
        function createCells(item, index) {
            if (indices.includes(index)) {
                html += "<td>" + item + "</td>\r\n";
            }
        }
        html += "</tbody>";
        html += "</table>";
        html += "</div>";
        html += "<br>"
    }
    return html;
}
  


