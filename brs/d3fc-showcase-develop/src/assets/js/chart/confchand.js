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

    var analyseSellBuy = function(dataValue0, dataValueprec) {
        if (dataValue0.rsi <= 30.0 && !dataValue0.inposition) {
            dataValue0.action = 'buy';
            dataValue0.position = dataValue0.close;
            dataValue0.inposition = true;
        }
        else if (dataValue0.inposition) {
            if (dataValue0.ma20 && dataValue0.ma50 && dataValueprec.ma20 && dataValueprec.ma50) {
                var indic = (dataValue0.ma20 < dataValue0.ma50) && (dataValueprec.ma20 >= dataValueprec.ma50);
                if (indic && dataValue0.close > dataValue0.position * 1.03) {
                    dataValue0.action = 'sell';
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

    var analyseday = function(dataValue0) {

        if (dataValue0.open >= dataValue0.close) {
            dataValue0.tendance = 'down';
            dataValue0.lowOC = dataValue0.close;
            dataValue0.highOC = dataValue0.open;
            if (dataValue0.close === dataValue0.low && dataValue0.open === dataValue0.high) {
                dataValue0.typebougie = 'marubozu';
            }
            else if (dataValue0.close === dataValue0.low) {
                dataValue0.typemeche = 'meche haute';
            }
            else if (dataValue0.open === dataValue0.high) {
                dataValue0.typemeche = 'meche basse';
            }
        }
        else {
            dataValue0.tendance = 'up';
            dataValue0.lowOC = dataValue0.open;
            dataValue0.highOC = dataValue0.close;
            if (dataValue0.close === dataValue0.high && dataValue0.open === dataValue0.low) {
                dataValue0.typebougie = 'marubozu';
            }
            else if (dataValue0.close === dataValue0.high) {
                dataValue0.typemeche = 'meche basse';
            }
            else if (dataValue0.open === dataValue0.low) {
                dataValue0.typemeche = 'meche haute';
            }
        }
        dataValue0.ptMedian = (dataValue0.lowOC + dataValue0.highOC) / 2;
        dataValue0.tailleCorps = dataValue0.highOC - dataValue0.lowOC;
        dataValue0.tailleTotale = dataValue0.high - dataValue0.low;
        dataValue0.tailleOmbre = dataValue0.tailleTotale - dataValue0.tailleCorps;

        if (dataValue0.typemeche === 'meche basse') {
            if (dataValue0.tailleCorps < dataValue0.tailleOmbre) {
                dataValue0.typebougie = 'marteau';
            }
            else {
                dataValue0.typebougie = 'passant de ceinture baissier';
            }
        }
        else if (dataValue0.typemeche === 'meche haute') {
            if (dataValue0.tailleCorps < dataValue0.tailleOmbre) {
                dataValue0.typebougie = 'marteau inversé';
            }
            else {
                dataValue0.typebougie = 'passant de ceinture haussier';
            }
        }

        if ((dataValue0.tailleCorps / dataValue0.tailleTotale) < 0.02) {
            dataValue0.typebougie = 'doji';
        }

    };

    var slidingWindow = fc.indicator.algorithm.calculator.slidingWindow()
        .windowSize(4)
        .accumulator(function(values) {
            var dataValue0 = dataValue(values[2]);
            var dataValue1 = dataValue(values[3]);

            dataValue1.inposition = dataValue0.inposition;
            dataValue1.position = dataValue0.position;
            dataValue1.gain = dataValue0.gain;
            analyseday(dataValue0);
            analyseday(dataValue1);
            analyseSellBuy(dataValue1, dataValue0);
            if (dataValue1.low > dataValue0.high) {
                return 'gap';
            }
            if (dataValue1.high < dataValue0.low) {
                return 'gap';
            }

            if (dataValue1.lowOC > dataValue0.lowOC && dataValue1.highOC < dataValue0.highOC && dataValue1.tendance !== dataValue0.tendance) {
                if (dataValue1.tendance === 'up') {
                    return 'harami haussier';
                }
                else {
                    return 'harami baissier';
                }
            }
            if (dataValue1.lowOC < dataValue0.lowOC && dataValue1.highOC > dataValue0.highOC && dataValue1.tendance !== dataValue0.tendance) {
                if (dataValue1.tendance === 'up') {
                    return 'englobante haussiere';
                }
                else {
                    return 'englobante baissiere';
                }
            }
            //Ligne de poussée
            if (dataValue1.tendance === 'up' && dataValue0.tendance === 'down' && dataValue1.lowOC < dataValue0.lowOC && dataValue1.highOC < dataValue0.ptMedian && dataValue1.highOC > dataValue0.lowOC) {
                return 'Ligne de poussée';
            }

            return dataValue1.typebougie;
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
