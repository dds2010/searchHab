var fs = require('fs');

var http = require('http');
var crontab = require('node-crontab');

var total="TOTF.PA";

var jobId = crontab.scheduleJob("*/2 * * * * *", function(){ //This will call this function every 2 minutes 
    console.log("It's been 2 seconds!");
    getRealTimeQuote();
});



url="/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20%28%22TOTF.PA%22%29&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
url="/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20%28%22TOTF.PA%22,%22CS.PA%22%29&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="




var startDate = '2012-01-01';
var endDate = '2013-01-08';
var data = encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("'+total+'","CS.PA") and startDate = "' + startDate + '" and endDate = "' + endDate + '"');


url='/v1/public/yql?q=' + data + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";







http.get({
        host: 'query.yahooapis.com',
        path: url
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function(){
    // Data reception is done, do whatever with it!
            var _return = JSON.parse(body);
            //console.log(_return);
            console.log(_return.query);

             var totalReturned = _return.query.count;
            //OR: var totalReturned = _return.query.results.quote.length;
            for (var i = 0; i < totalReturned; ++i) {
                var stock = _return.query.results.quote[i];
                //console.log(stock);
                var symbol = stock.Symbol;
                var percent_change = stock.Change_PercentChange;
                var changeRealTime = stock.ChangeRealtime;
                
                //console.log(stock.Name+" "+symbol+" "+stock.Ask+" "+percent_change+" "+changeRealTime);
                console.log(stock.Symbol+" "+stock.Date+" "+stock.Open+" "+stock.High+" "+stock.Low+" "+stock.Close);

            }
});
    });


var getRealTimeQuote=function(){
    url='/webservice/v1/symbols/'+total+'/quote?format=json&view=detail'


    http.get({
            host: 'finance.yahoo.com',
            path: url
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function(){

                var _return = JSON.parse(body);
                //console.log(_return);
                //console.log(_return.list.resources[0].resource.fields.price);

                 var totalReturned = _return.list.resources.length;
                //OR: var totalReturned = _return.query.results.quote.length;
                for (var i = 0; i < totalReturned; ++i) {
                    var stock = _return.list.resources[i].resource.fields;
                   
                    //console.log(stock.Name+" "+symbol+" "+stock.Ask+" "+percent_change+" "+changeRealTime);
                    console.log(stock.name+" "+stock.utctime+" "+stock.price+" "+stock.day_high+" "+stock.day_low+" "+stock.volume);

                }
    });
        });


}

