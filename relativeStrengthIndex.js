var fc = require("d3fc");

var rsiIndic = function() {

    var openValue = function(d, i) { return d.open; },
        closeValue = function(d, i) { return d.close; },
        averageAccumulator = function(values) {
            var alpha = 1 / values.length;
            var result = values[0];
            for (var i = 1, l = values.length; i < l; i++) {
                result = alpha * values[i] + (1 - alpha) * result;
            }
            return result;
        };

    var slidingWindow = fc.indicator.algorithm.calculator.slidingWindow()
        .windowSize(15)
        .accumulator(function(values) {
            var downCloses = [];
            var upCloses = [];
            //console.log(values.length);
            var sumDown=0;
            var sumUp=0;
            var lastUp=0;
            var lastDown=0;
            for (var i = 1, l = values.length; i < l; i++) {
                var value = values[i];

                var open = openValue(value);
                var open = closeValue(values[i-1]);
                var close = closeValue(value);
                lastUp=open < close ? close - open : 0;
                lastDown=open > close ? open - close : 0;
                sumDown+=open > close ? open - close : 0;
                sumUp+=open < close ? close - open : 0;
                downCloses.push(open > close ? open - close : 0);
                upCloses.push(open < close ? close - open : 0);
            }

            var downClosesAvg = averageAccumulator(downCloses);
            if (downClosesAvg === 0) {
                return 100;
            }
            //console.log("sumUp "+sumUp);
            //console.log("sumDown "+sumDown);
            var rs = averageAccumulator(upCloses) / downClosesAvg;
            //var rs=(sumUp/14)/(sumDown/14);
            
            var H=sumUp/14;
            var B=sumDown/14;
            if(values[13].H && values[13].B){
                H=(values[13].H * 13 +lastUp)/14;
                B=(values[13].B * 13 +lastDown)/14;
            }
            

            values[14].H=H;
            values[14].B=B;
            values[14].RSI=100*(H/(H+B));
            return 100*(H/(H+B));
            //return 100 - (100 / (1 + rs));
        });

    var rsi = function(data) {
        return slidingWindow(data);
    };

    rsi.openValue = function(x) {
        if (!arguments.length) {
            return openValue;
        }
        openValue = x;
        return rsi;
    };
    rsi.closeValue = function(x) {
        if (!arguments.length) {
            return closeValue;
        }
        closeValue = x;
        return rsi;
    };


    return rsi;
}
module.exports = rsiIndic;