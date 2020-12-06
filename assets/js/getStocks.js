var stocks = new Stocks('83KVLMW7SXCXA055');
var options = {
    symbol: 'NDAQ',
    interval: 'daily',
    amount: 60
};
const headers = ["Day", "Open", "High", "Low", "Close"]

async function getStocksData() {
    const result = await stocks.timeSeries(options);

        var oReq = new XMLHttpRequest();
        oReq.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                
                var CovidData = CSVToArray(this.responseText);
                CovidData.push(["Date", "Cases", "Deaths"]);

                CovidData = CovidData.slice(Math.max(CovidData.length - 60, 0)).reverse();
                console.log(CovidData);



                var resArray = [];
                var resArrayTot = [];
                resArray.push(headers);
                resArrayTot.push(headers);
            
                for (let i=0; i<result.length; i++) {
                    let day = result[i];
                    const date = day["date"];
                    const dateString = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
                    const vol = day["volume"];
            
                    let dayArr = [dateString, day["open"], day["high"], day["low"], day["close"]];
                    let dayArrTot =  [dateString, day["open"]*vol, day["high"]*vol, day["low"]*vol, day["close"]*vol];
                    resArray.push(dayArr);
                    resArrayTot.push(dayArrTot);
                }
                console.log(resArray);
            
                // Visualize
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawChart);
                google.charts.setOnLoadCallback(drawChartTot);
            
            
                function drawChart() {
                  console.log(resArray);
                  console.log(typeof(resArray));
                  var data = google.visualization.arrayToDataTable(resArray);
            
                  var options = {
                    title: 'Market Performance (Nasdaq) Average, Last 60 Days',
                    curveType: 'function',
                    legend: { position: 'bottom' },
                    hAxis: { direction:-1}
                  };
            
                  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
            
                  chart.draw(data, options);
                }
            
                function drawChartTot() {
                    var data = google.visualization.arrayToDataTable(resArrayTot);
              
                    var options = {
                      title: 'Market Performance (Nasdaq) Total, Last 60 Days',
                      curveType: 'function',
                      legend: { position: 'bottom' },
                      hAxis: { direction:-1}
                    };
              
                    var chart = new google.visualization.LineChart(document.getElementById('curve_chart_tot'));
              
                    chart.draw(data, options);
                }

                var visArr = [];
                visArr.push(["Date", "Covid Cases", "Covide Deaths", "Market Cap"]);

                // normalize
                var [caseMin, caseMax, caseAvg] = [0, 0, 0];
                var [deathMin, deathMax, deathAvg] = [0, 0, 0];
                var [marketMin, marketMax, marketAvg] = [0, 0, 0];

                for (let i=1; i<CovidData.length; i++) {
                    caseAvg += Number(CovidData[i][1]);
                    if (caseMin >= Number(CovidData[i][1])) {
                        caseMin = Number(CovidData[i][1]);
                    } else if (caseMax <= Number(CovidData[i][1])) {
                        caseMax = Number(CovidData[i][1]);
                    }

                    deathAvg += Number(CovidData[i][2]);
                    if (deathMin >= Number(CovidData[i][2])) {
                        deathMin = Number(CovidData[i][2]);
                    } else if (deathMax <= Number(CovidData[i][2])) {
                        deathMax = Number(CovidData[i][2]);
                    }

                    marketAvg += resArrayTot[i][2];
                    if (marketMin >= resArrayTot[i][2]) {
                        marketMin = resArrayTot[i][2];
                    } else if (marketMax <= resArrayTot[i][2]) {
                        marketMax = resArrayTot[i][2];
                    }
                }

                caseAvg /= CovidData.length;
                deathAvg /= CovidData.length;
                marketAvg /= CovidData.length;

                const caseSpread = caseMax - caseMin;
                const deathSpread = deathMax - deathMin;
                const marketSpread = marketMax - marketMin;



                for (let i=1; i<CovidData.length; i++) {
                    visArr.push([resArrayTot[i][0], (Number(CovidData[i][1])-caseMin)/caseSpread, (Number(CovidData[i][2])-deathMin)/deathSpread, (resArrayTot[i][2]-marketMin)/marketSpread]);
                }


                console.log(visArr);
                google.charts.setOnLoadCallback(drawChartCovid);
                function drawChartCovid() {
                    var data = google.visualization.arrayToDataTable(visArr);
              
                    var options = {
                      title: 'Covid Cases Compared w. Market Performance (Normalized)',
                      curveType: 'function',
                      legend: { position: 'bottom' },
                      hAxis: { direction:-1}
                    };
              
                    var chart = new google.visualization.LineChart(document.getElementById('curve_chart_covid'));
              
                    chart.draw(data, options);
                  }
            }
          };
        oReq.open("GET", "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv", "true");
        oReq.send(null);

}

getStocksData();

  
