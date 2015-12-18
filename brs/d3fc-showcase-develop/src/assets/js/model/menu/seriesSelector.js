import fc from 'd3fc';
import option from './option';
import candlestickSeries from '../../series/candlestick';
import util from '../../util/util';

export default function() {

    var candlestick = candlestickSeries();

    candlestick.id = util.uid();
    var candlestickOption = option(
      'Candlestick',
      'candlestick',
      candlestick,
      'sc-icon-candlestick-series');
    candlestickOption.isSelected = true;

    var ohlc = fc.series.ohlc();
    ohlc.id = util.uid();

    var line = fc.series.line();
    line.id = util.uid();

    ohlc.decorate(function(sel) {
        /*sel.attr('fill', function(d, i) { return '#AEDEDE'; })
            .attr('stroke', function(d, i) { return '#FFFFFF'; })
            .attr('class', '');*/
        sel.append('polygon').attr('points', '-10,0 10,0 0,30').attr('fill', function(d, i) {
            if (d.action === 'sell') {
                return 'red';
            }
            return 0;
        }).attr('visibility', function(d, i) {
            if (d.action === 'sell') {
                return 'visible';
            }
            return 'hidden';
        }).attr('cy', 50);

        sel.append('circle')
            .attr('r', function(d, i) {
                if (d.action === 'buy') {
                    return 10;
                }
                return 0;
            })
            .attr('fill', function(d, i) {
                if (d.action === 'buy') {
                    return 'green';
                }
                return 0;
            }).attr('cy', 50);
    });

    var point = fc.series.point();
    point.id = util.uid();

    var area = fc.series.area();
    area.id = util.uid();

    return {
        config: {
            title: null,
            careted: false,
            listIcons: true,
            icon: true
        },
        options: [
            candlestickOption,
            option('OHLC', 'ohlc', ohlc, 'sc-icon-ohlc-series'),
            option('Line', 'line', line, 'sc-icon-line-series'),
            option('Point', 'point', point, 'sc-icon-point-series'),
            option('Area', 'area', area, 'sc-icon-area-series')
        ]};
}
