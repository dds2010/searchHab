import calculator from './calculator/confchand';
import d3 from 'd3';
import fc from 'd3fc';
//import merge from './merge';

export default function() {

    var force = calculator();

    var mergedAlgorithm = fc.indicator.algorithm.merge()
        .algorithm(force)
        .merge(function(datum, indicator) {
            datum.chandelierInd = indicator;
        });

    var chandelierIndicator = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(chandelierIndicator, mergedAlgorithm, 'merge');
    d3.rebind(chandelierIndicator, force, 'windowSize', 'volumeValue', 'closeValue');

    return chandelierIndicator;
}
