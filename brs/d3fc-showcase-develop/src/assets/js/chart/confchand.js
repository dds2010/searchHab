import d3 from 'd3';
import fc from 'd3fc';
//import _slidingWindow from './slidingWindow';

export default function() {

    var volumeValue = function(d, i) { return d.volume; },
        closeValue = function(d, i) { return d.close; },
        highValue = function(d, i) { return d.high; },
        lowValue = function(d, i) { return d.low; },
        openValue = function(d, i) { return d.open; },
        dataValue = function(d, i) { return d; };

    var slidingWindow = fc.indicator.algorithm.calculator.slidingWindow()
        .windowSize(2)
        .accumulator(function(values) {
            var dataValue0= dataValue(values[0]);
            var dataValue1= dataValue(values[1]);
            if(dataValue0.open>=dataValue0.close){
                dataValue0.tendance = 'down';
                dataValue0.lowOC = dataValue0.close;
                dataValue0.highOC = dataValue0.open;
            }
            else{
                dataValue0.tendance = 'up';
                dataValue0.lowOC = dataValue0.open;
                dataValue0.highOC = dataValue0.close;
            }
            if(dataValue1.open>=dataValue1.close){
                dataValue1.tendance = 'down';
                dataValue1.lowOC = dataValue1.close;
                dataValue1.highOC = dataValue1.open;
            }
            else{
                dataValue1.tendance = 'up';
                dataValue1.lowOC = dataValue1.open;
                dataValue1.highOC = dataValue1.close;
            }

            if(dataValue1.lowOC>dataValue0.lowOC && dataValue1.highOC<dataValue0.highOC && dataValue1.tendance!= dataValue0.tendance){
                return 'harami';
            }


            return {dataValue0: dataValue(values[0]),
                    dataValue1: dataValue(values[1]),
                    highValue0: highValue(values[0]),
                    highValue1: highValue(values[1])
            };
            //return (closeValue(values[1]) - closeValue(values[0])) * volumeValue(values[1]);
        });

    var confchand = function(data) {
        return slidingWindow(data);
    };
 
    confchand.dataValue = function(x) {
        if (!arguments.length) {
            return dataValue;
        }
        dataValue = x;
        return confchand;
    };

    confchand.volumeValue = function(x) {
        if (!arguments.length) {
            return volumeValue;
        }
        volumeValue = x;
        return confchand;
    };
    confchand.closeValue = function(x) {
        if (!arguments.length) {
            return closeValue;
        }
        closeValue = x;
        return confchand;
    };

    confchand.highValue = function(x) {
        if (!arguments.length) {
            return highValue;
        }
        highValue = x;
        return confchand;
    };
    confchand.lowValue = function(x) {
        if (!arguments.length) {
            return highValue;
        }
        lowValue = x;
        return confchand;
    };

      confchand.openValue = function(x) {
        if (!arguments.length) {
            return openValue;
        }
        openValue = x;
        return confchand;
    };

    d3.rebind(confchand, slidingWindow, 'windowSize');

    return confchand;
}
