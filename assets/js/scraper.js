function scrapeJHUData() {
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            var data = CSVToArray(this.responseText);
            var table = arrayToTablePartial(data);
            document.getElementById("csv-data").innerHTML = table;
        }
      };
    var date = new Date();  
    date.setDate(date.getDate() - 100);
    var dateString = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
    console.log(dateString);
    oReq.open("GET", `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${dateString}.csv`, "true");
    oReq.send(null);
}

function scrapeFullJHUData() {
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            var data = CSVToArray(this.responseText);
            var table = arrayToTableComplete(data);
            document.getElementById("csv-data").innerHTML = table;
        }
      };
    oReq.open("GET", "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-24-2020.csv", "true");
    oReq.send(null);
}

function dateTry() {
    var date = new Date();
    date.setDate(date.getDate() - 100);
    console.log(((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear());
}

dateTry();