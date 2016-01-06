var fc = require("d3fc");

var sellBuyIndic = function() {

    var analyseSellBuy = function(dataValue0, dataValueprec) {

        //report des variables qui suivent le mvt
        dataValue0.inposition = dataValueprec.inposition;
        dataValue0.position = dataValueprec.position;
        dataValue0.gain = dataValueprec.gain;

        //console.log("analyse "+" le "+ dataValue0.date);
        if (!dataValue0.gain) {
             dataValue0.gain=0;
        }
        if (dataValue0.rsi <= 30.0 && !dataValue0.inposition /*&& dataValue0.ma100 > dataValueprec.ma100*/) {
            dataValue0.action = 'buy';
            dataValue0.position = dataValue0.close;
            dataValue0.inposition = true;
            console.log("buy "+ dataValue0.close +" le "+ dataValue0.date);
        }
        else if (dataValue0.inposition) {
            if (dataValue0.mae20 && dataValue0.mae50 && dataValueprec.mae20 && dataValueprec.mae50) {
                var indic = (dataValue0.mae20 < dataValue0.mae50) && (dataValueprec.mae20 >= dataValueprec.mae50);
                if (indic && dataValue0.close > dataValue0.position * 1.03) {
                    dataValue0.action = 'sell';
                     console.log("sell"+ dataValue0.close);
                    dataValue0.inposition = false;
                    var precGain = 0;
                    if (dataValue0.gain) {
                        precGain = dataValue0.gain;
                    }
                    dataValue0.gain = dataValue0.close - dataValue0.position + precGain;
                }
            }
        }
    };


    var slidingWindow = fc.indicator.algorithm.calculator.slidingWindow()
        .windowSize(2)
        .accumulator(function(values) {
            var today=values[1];
            var yesterday=values[0];
            analyseSellBuy(today,yesterday);
            if(today.rsi<30){
                //console.log("point d'entrée "+today.rsi);
            }
            if (today.ma100 < yesterday.ma100) {
                //console.log("tendance baisse :"+today.ma100);
            }
            else {
                //console.log("tendance hausse :"+today.ma100);
            }

            if (today.mae20 < today.mae50 && yesterday.mae20 >= yesterday.mae50) {
                //console.log("croisement mae baisse "+today.mae20);
            }
            if (today.mae20 > today.mae50 && yesterday.mae20 <= yesterday.mae50) {
                //console.log("croisement mae hausse "+today.mae20);
            }
            //return 100 - (100 / (1 + rs));
        });

    var sb = function(data) {
        return slidingWindow(data);
    };

  


    return sb;
}
module.exports = sellBuyIndic;