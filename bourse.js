var fs = require('fs');
var datas = require("./brs/data.js");

var rsiIndic = require("./brs/indic/relativeStrengthIndex");
var sellBuyIndic = require("./brs/indic/sellBuyIndic");

var fc = require("d3fc");

var liste= new datas().get();
var http = require('http');
var crontab = require('node-crontab');
var nodemailer = require('nodemailer');

var total="TOTF.PA";

var limits={
    "MT":{highLimit:5,lowLimit:4.44,send:true},
    "FP":{highLimit:48,lowLimit:40,send:true},
    "AIR":{highLimit:67.80,lowLimit:66.8,send:true},
    "CS":{highLimit:26,lowLimit:25,send:true},
    "AKE":{highLimit:71,lowLimit:65,send:true},
    "VIE":{highLimit:24,lowLimit:21,send:true},
    "DSY":{highLimit:77,lowLimit:72,send:true},
    "BN":{highLimit:66,lowLimit:61,send:true},
    "ERESEDRACTIO.PA":{highLimit:25,lowLimit:20,send:true},
    "FR0010106880.PA":{highLimit:180,lowLimit:160,send:true}
}



var passMail=process.argv[2];
var destMail=process.argv[3];
var obj=[];
var jobId = crontab.scheduleJob("*/2 09-18 * * 1-5", function(){ //This will call this function every 2 minutes 
    getYahooRealTimeQuote();
    getGoogleRealTimeQuote();
   
    //fs.writeFileSync("bourse.log", JSON.stringify(obj, null, 2));
});



url="/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20%28%22TOTF.PA%22%29&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
url="/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20%28%22TOTF.PA%22,%22CS.PA%22%29&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="


var sendMail=function(message){
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'searchhab35@gmail.com',
        pass: passMail
    }
    }, {
        // default values for sendMail method
        from: 'sender@address',
        headers: {
            'My-Awesome-Header': '123'
        }
    });
    transporter.sendMail({
        to: destMail,
        subject: 'hello',
        text: 'modif '+message
    });
}


var analyseQuote=function(newdata,name){
    var rsi = new rsiIndic();
               
    var ma100 = fc.indicator.algorithm.movingAverage()
                        .windowSize(100)
                        .value(function(d) { return d.close; })
                        .merge(function(d, m) { d.ma100 = m; });
    newdata=newdata.reverse();
    ma100(newdata);

    var movingAverage50 = fc.indicator.algorithm.exponentialMovingAverage()
        .value(function(d) { return d.close; })
        .merge(function(d, m) { d.mae50 = m; })
        .windowSize(50);

    movingAverage50(newdata);

    var movingAverage20 = fc.indicator.algorithm.exponentialMovingAverage()
        .value(function(d) { return d.close; })
        .merge(function(d, m) { d.mae20 = m; })
        .windowSize(20);

    movingAverage20(newdata);

    var test=rsi(newdata);

    var sbIndic = new sellBuyIndic();
    sbIndic(newdata);
    var today=newdata[test.length-1];
    gain=today.gain;
    if(today.inposition){
        gain+=today.close-today.position;
    }
    console.log(name+' GAIN: '+gain);
    console.log(name+ ' GAIN %: '+gain*100/today.close);
    /*var today=newdata[test.length-1];
    var yesterday=newdata[test.length-2];

    console.log(name+ " : "+test[test.length-1]);
    if(test[test.length-1]<30){
        console.log("point d'entrée "+name);
    }
    if (today.ma100 < yesterday.ma100) {
        console.log("tendance baisse :"+newdata[test.length-1].ma100);
    }
    else {
        console.log("tendance hausse :"+newdata[test.length-1].ma100);
    }

    if (today.mae20 < today.mae50 && yesterday.mae20 >= yesterday.mae50) {
        console.log("croisement mae baisse "+name);
    }
    if (today.mae20 > today.mae50 && yesterday.mae20 <= yesterday.mae50) {
        console.log("croisement mae hausse "+name);
    }*/

}
var processQuote=function(_return){
    var totalReturned = _return.query.results.quote.length;
            for (var i = 0; i < totalReturned; ++i) {
                var stock = _return.query.results.quote[i];
                //console.log(stock);
                var symbol = stock.Symbol;
                stock.date = new Date(stock.Date);
                stock.date.setHours(0);
                stock.date.setMinutes(0);
                stock.date.setSeconds(0);
                _return.query.results.quote[i] = {
                    date: stock.date,
                    open: parseFloat(stock.Open),
                    high: parseFloat(stock.High),
                    low: parseFloat(stock.Low),
                    close: parseFloat(stock.Close),
                    volume: parseFloat(stock.Volume)
                };
            }
    return _return;

}

var mergeDatas=function(name){
        var obj2016 = JSON.parse(fs.readFileSync('brs/data/2016/'+liste[l][2]+'.'+liste[l][3]+'.json', 'utf8'));
        var obj2015 = JSON.parse(fs.readFileSync('brs/data/2015/'+liste[l][2]+'.'+liste[l][3]+'.json', 'utf8'));
        var obj2014 = JSON.parse(fs.readFileSync('brs/data/2014/'+liste[l][2]+'.'+liste[l][3]+'.json', 'utf8'));
        var obj2013 = JSON.parse(fs.readFileSync('brs/data/2013/'+liste[l][2]+'.'+liste[l][3]+'.json', 'utf8'));
        if(fs.existsSync('brs/data/2012/'+liste[l][2]+'.'+liste[l][3]+'.json'))
            var obj2012 = JSON.parse(fs.readFileSync('brs/data/2012/'+liste[l][2]+'.'+liste[l][3]+'.json', 'utf8'));

        if(obj2016.query.results && obj2015.query.results && obj2014.query.results && obj2013.query.results){
            obj2016.query.results.quote=obj2016.query.results.quote.concat(obj2015.query.results.quote);
            obj2016.query.results.quote=obj2016.query.results.quote.concat(obj2014.query.results.quote);
            obj2016.query.results.quote=obj2016.query.results.quote.concat(obj2013.query.results.quote);
            
        }
        if(obj2016.query.results && obj2012 && obj2012.query.results){
            obj2016.query.results.quote=obj2016.query.results.quote.concat(obj2012.query.results.quote);
        }
        if(obj2016.query.results){
            fs.writeFileSync('brs/data/'+liste[l][2]+'.'+liste[l][3]+'.json', JSON.stringify(obj2016, null, 2)); 
        }
        

};
var getHistoricalQuote=function(name){

    var startDate = '2016-01-01';
    
    var today = new Date(); 
    var endDate = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    //var endDate = '2015-12-31';
    var data = encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("'+name+'") and startDate = "' + startDate + '" and endDate = "' + endDate + '"');


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
                var _return = JSON.parse(body);
                 fs.writeFileSync('brs/data/2016/'+name+'.json', JSON.stringify(_return, null, 2));
                //_return =processQuote(_return);
    });
        });

}



var getGoogleRealTimeQuote=function(){
   var url='/finance/info?client=ig&q=EPA:FP,AMS:MT,EPA:AIR,EPA:CS,EPA:AKE,EPA:VIE,EPA:DSY,EPA:BN';//,EPA:CS


    http.get({
            host: 'finance.google.com',
            path: url
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                
                body += d;
            });
            response.on('end', function(){
               // console.log(body);
                var _return = JSON.parse(body.replace('//',''));
                //console.log(_return);
                //console.log(_return.list.resources[0].resource.fields.price);

                 var totalReturned = _return.length;
                //OR: var totalReturned = _return.query.results.quote.length;
                for (var i = 0; i < totalReturned; ++i) {
                    var stock = _return[i];
                   
                    //console.log(stock.Name+" "+symbol+" "+stock.Ask+" "+percent_change+" "+changeRealTime);
                    console.log("Google:"+stock.t+" "+stock.ltt+" "+stock.l_fix+" "+stock.c+" "+stock.cp+" "+stock.l);
                    if(stock.l_fix>limits[stock.t].highLimit && limits[stock.t].send){
                        console.log("sending"+stock.l_fix);
                        sendMail(" hausse de "+stock.t+" a "+stock.l_fix);
                        limits[stock.t].send=false;
                    }
                    else if(stock.l_fix<limits[stock.t].lowLimit && limits[stock.t].send){
                        console.log("sending"+stock.l_fix);
                        sendMail(" baisse de "+stock.t+" a "+stock.l_fix);
                        limits[stock.t].send=false;
                    }

                }
    });
        });


}




var getYahooRealTimeQuote=function(){

    eresCode="ERESEDRACTIO.PA";

    
    var url='/webservice/v1/symbols/'+eresCode+'/quote?format=json&view=detail';


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
                    //console.log(stock);//symbol
                    //console.log(stock.Name+" "+symbol+" "+stock.Ask+" "+percent_change+" "+changeRealTime);
                    console.log("Yahoo:"+stock.name+" "+stock.utctime+" "+stock.price+" "+stock.day_high+" "+stock.day_low+" "+stock.volume);
                    console.log(parseFloat(stock.price)>25);
                    console.log(parseFloat(stock.price));
                    if(parseFloat(stock.price)>limits[stock.symbol].highLimit && limits[stock.symbol].send){
                        obj.push({"message":stock,"test":parseFloat(stock.price)>limits[stock.symbol].highLimit})
                        console.log("sending"+stock.price);
                        sendMail(" hausse de ERES "+stock.price);
                        limits[stock.symbol].send=false;
                    }
                    else if(parseFloat(stock.price)<limits[stock.symbol].lowLimit && limits[stock.symbol].send){
                        
                        console.log("sending"+stock.price);
                        sendMail(" baisse de ERES "+stock.price);
                        limits[stock.symbol].send=false;
                    }
                }
    });
        });

var ATOUTEUROLAND="FR0010106880.PA";
 var url='/webservice/v1/symbols/'+ATOUTEUROLAND+'/quote?format=json&view=detail';


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
                    
                    console.log("Yahoo:"+stock.name+" "+stock.utctime+" "+stock.price+" "+stock.day_high+" "+stock.day_low+" "+stock.volume);
                    if(parseFloat(stock.price)>limits[stock.symbol].highLimit && limits[stock.symbol].send){
                        obj.push({"message":stock,"test":parseFloat(stock.price)>limits[stock.symbol].highLimit})
                        console.log("sending"+stock.price);
                        sendMail(" hausse de ATOUTEUROLAND "+stock.price);
                        limits[stock.symbol].send=false;
                    }
                    else if(parseFloat(stock.price)<limits[stock.symbol].lowLimit && limits[stock.symbol].send){
                        
                        console.log("sending"+stock.price);
                        sendMail(" baisse de ATOUTEUROLAND "+stock.price);
                        limits[stock.symbol].send=false;
                    }
                }
    });
        });


}
/*
 var liste = ['CS.PA', 'FP.PA', 'AKE.PA', 'SGO.PA', 'AIR.PA', 'SU.PA', 'TMM.PA', 
 'RNO.PA', 'BN.PA', 'OR.PA', 'SAN.PA', 'AC.PA', 'VIE.PA',
 'CAP.PA', 'CGE.PA', 'GLE.PA', 'ACA.PA', 'DX.PA'
 ];
*/
    for (var l = 0; l < liste.length; l++) {
        //console.log("getHistoricalQuote "+liste[l][2]+'.'+liste[l][3])
        getHistoricalQuote(liste[l][2]+'.'+liste[l][3]);
        mergeDatas(liste[l][2]+'.'+liste[l][3]);
        if(fs.existsSync('brs/data/'+liste[l][2]+'.'+liste[l][3]+'.json')){
            var obj = JSON.parse(fs.readFileSync('brs/data/'+liste[l][2]+'.'+liste[l][3]+'.json', 'utf8'));
            obj =processQuote(obj);
            analyseQuote(obj.query.results.quote,liste[l][2]+'.'+liste[l][3]);
            fs.writeFileSync('brs/data/result/'+liste[l][2]+'.'+liste[l][3]+'.json', JSON.stringify(obj, null, 2));
            var lastdatas=obj.query.results.quote[obj.query.results.quote.length-1];
            if(lastdatas.action){
                console.log(lastdatas);
                sendMail(" action sur "+liste[l][2]+'.'+liste[l][3] +" "+lastdatas);
            }
            
        }
    }




//var obj = JSON.parse(fs.readFileSync('brs/data/SGO.PA.json', 'utf8'));
//obj =processQuote(obj);

//analyseQuote(obj.query.results.quote,"test");
//console.log(obj.query.results.quote);
//getGoogleRealTimeQuote();
//getYahooRealTimeQuote();
//sendMail();