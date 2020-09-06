// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useState, useMemo} from 'react';
import PropTypes from 'prop-types';

import RangeBrushFactory from './range-brush';
import HistogramPlotFactory from './histogram-plot';
import LineChartFactory from './line-chart';

const chartMargin = {top: 18, bottom: 0, left: 0, right: 0};
const chartH = 62;
const chartHLarge = 112;

const containerH = 78;
const containerHLarge = 130;

RangePlotFactory.deps = [RangeBrushFactory, HistogramPlotFactory, LineChartFactory];
export default function RangePlotFactory(RangeBrush, HistogramPlot, LineChart) {
  const RangePlot = ({
    onBrush, 
    range, 
    value, 
    width, 
    plotType, 
    lineChart, 
    histogram,
    isEnlarged,
    ...chartProps
  }) => {

    const [brushing, setBrushing] = useState(false);

    const brushComponent = (
      <RangeBrush
        onBrush={onBrush}
        onBrushStart={() => setBrushing(true)}
        onBrushEnd={() => setBrushing(false)}
        range={range}
        value={value}
        width={width}
        {...chartProps}
      />
    );
    const containerHeight = isEnlarged ? containerHLarge : containerH;

    return (
      <div
        style={{
          height: `${containerHeight}px`,
          position: 'relative'
        }}
      >
        {plotType === 'lineChart' && lineChart ? (
          <LineChart
            // hoveredDP={hoveredDP}
            width={width}
            height={isEnlarged ? chartHLarge : chartH}
            margin={chartMargin}
            children={brushComponent}

            lineChart={lineChart}
            brushing={brushing}
            isEnlarged={isEnlarged}
            {...chartProps}

            // onMouseMove={onMouseMove}
            // yDomain={lineChart.yDomain}
            // hintFormat={hintFormatter}
            // data={lineChart.series}
          />
        ) : (
          <HistogramPlot
            width={width}
            height={isEnlarged ? chartHLarge : chartH}
            value={value}
            margin={chartMargin}
            histogram={histogram}
            brushComponent={brushComponent}
            {...chartProps}
          />
        )}
      </div>
    );
  };

  RangePlot.propTypes = {
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    histogram: PropTypes.arrayOf(
      PropTypes.shape({
        x0: PropTypes.number,
        x1: PropTypes.number
      })
    ),
    lineChart: PropTypes.object,
    plotType: PropTypes.string,
    isEnlarged: PropTypes.bool,
    onBlur: PropTypes.func,
    width: PropTypes.number.isRequired
  };
  return RangePlot;
}
