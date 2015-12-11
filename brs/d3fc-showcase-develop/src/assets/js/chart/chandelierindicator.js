import calculator from './confchand';
import d3 from 'd3';
import fc from 'd3fc';
//import merge from './merge';

export function chandelierIndicator() {

    var force = calculator();

    var mergedAlgorithm = fc.indicator.algorithm.merge()
        .algorithm(force)
        .merge(function(datum, indicator) {
            datum.chandelierInd = indicator;
        });

    var chandelierIndicatorAlgo = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(chandelierIndicatorAlgo, mergedAlgorithm, 'merge');
    d3.rebind(chandelierIndicatorAlgo, force, 'windowSize', 'volumeValue', 'closeValue', 'lowValue', 'openValue', 'highValue', 'dataValue');

    return chandelierIndicatorAlgo;
}
