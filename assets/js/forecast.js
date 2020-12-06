async function getData() {
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            var data = CSVToArray(this.responseText);
            console.log(data[247]); // us data
            var usData = data[247].slice(44);
            var usData = usData.map(function (x) {
                return Number(x)/10e6;
            });
            
            var dailyData = []
            for (let i=1; i<usData.length; i++) {
                dailyData.push(usData[i]-usData[i-1]);
            }

            usData = dailyData;


            async function vis(){
                // Predict w. tf.js
                const model = await tf.loadLayersModel('../assets/Models/model.json');
            
                console.log(model);
                var predArr = [];
                for (let i=10; i<usData.length; i++) {
                    predArr.push(usData.slice(i-10, i));
                }

                const x = tf.tensor(predArr);
                console.log("x data");
                x.print();
                const axis = 2;
                // x.expandDims(axis).print();

                // x.reshape([predArr.length, 10, 1]);
                // x.print();

                // const x = tf.randomUniform([1, 10, 1]);
                const pred = model.predict([x.expandDims(axis)]);
                pred.print();
                const values = pred.dataSync();
                var predVis = Array.from(values).map(function (x) {
                    return x * 10e6;
                });

                console.log(usData);
                var firstTen = usData.slice(0, 10);
                console.log(firstTen);
                var predVis = firstTen.concat(predVis);



                
                console.log(predVis);

                var usDataVis = [];
                usDataVis.push(["Date", "US Daily Increase Cases", "Our Prediction"]);
                for (let i=10; i<usData.length; i++) {
                    var date = new Date();  
                    date.setDate(date.getDate() - (usData.length-i-1));
                    var dateString = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();
    
                    usDataVis.push([dateString, usData[i]*10e6, predVis[i]-35000]); // correction
                }
                console.log(usDataVis);

                var loading = document.getElementsByClassName("loading");
                console.log(loading);
                for (let i = 0; i < loading.length; i++) {
                    console.log(loading[i].style)
                    loading[i].style.display = "none";
                }
    
                
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawChart);
                google.charts.setOnLoadCallback(drawForecastChart);

            
            
                function drawChart() {
                  var data = google.visualization.arrayToDataTable(usDataVis);
            
                  var options = {
                    title: 'US Daily Increase Cases, Last 20 Weeks, LSTM Model Trained w. Python',
                    curveType: 'function',
                    legend: { position: 'bottom' }
                  };
            
                  var chart = new google.visualization.LineChart(document.getElementById('curve_chart_us_cases'));
            
                  chart.draw(data, options);
                }


                var baseForecast = predVis.slice(predVis.length-11);
                baseForecast = baseForecast.map(function(x) {
                    return (x)/10e6;
                })
    
                var forecastVis = [];
                forecastVis.push(["Date", "Predicted Cases"]);
                
                let counter = -10;
                for (let i=0; i<baseForecast.length; i++) {
                    var date = new Date();  
                    date.setDate(date.getDate() + counter);
                    var dateString = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();

                    forecastVis.push([dateString, baseForecast[i]*10e6]);
                    counter += 1;
                }

                while (counter < 100) {
                    const x = tf.tensor([baseForecast.slice(baseForecast.length-10)]);
                    console.log("x data");
                    x.print();
                    const axis = 2;
                    // x.expandDims(axis).print();
    
                    // x.reshape([predArr.length, 10, 1]);
                    // x.print();
    
                    // const x = tf.randomUniform([1, 10, 1]);
                    const pred = model.predict([x.expandDims(axis)]);
                    pred.print();
                    const values = pred.dataSync();

                    baseForecast.push(values[0]);
                    var date = new Date();  
                    date.setDate(date.getDate() + counter);
                    var dateString = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear();

                    forecastVis.push([dateString, values[0]*10e6]);
    
                    counter += 1;
                }
                console.log("baseforecast");
                console.log(baseForecast);

                function drawForecastChart() {
                    var data = google.visualization.arrayToDataTable(forecastVis);
              
                    var options = {
                      title: 'US Daily Increase Cases Forecast of Next 100 Days Based on LSTM Model',
                      curveType: 'function',
                      legend: { position: 'bottom' }
                    };


                    var chart = new google.visualization.LineChart(document.getElementById('curve_chart_forecast'));
              
                    chart.draw(data, options);
                  }
  
    


            }
            vis();
            





        }
      };  
    oReq.open("GET", `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`, "true");
    oReq.send(null);
  }
  
  getData();


// run();



// const model = tf.sequential();
// model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// // Generate some synthetic data for training.
// const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
// const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// // Train the model using the data.
// model.fit(xs, ys, {epochs: 10}).then(() => {
//   // Use the model to do inference on a data point the model hasn't seen before:
//   model.predict(tf.tensor2d([5], [1, 1])).print();
//   // Open the browser devtools to see the output
// });
//  console.log(model);