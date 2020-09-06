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
import moment from 'moment';
import {LineSeries, XYPlot, CustomSVGSeries, Hint, MarkSeries} from 'react-vis';
import styled from 'styled-components';
import {getTimeWidgetHintFormatter} from 'utils/filter-utils';

const LineChartWrapper = styled.div`
  .rv-xy-plot__inner path {
    fill: none;
    stroke-width: 1.5;
  }
`;
const StyledHint = styled.div`
  background-color: #d3d8e0;
  border-radius: 2px;
  color: ${props => props.theme.textColorLT};
  font-size: 9px;
  margin: 4px;
  padding: 3px 6px;
  pointer-events: none;
  user-select: none;
`;

const HintContent = ({x, y, format}) => (
  <StyledHint>
    <div className="hint--x">{format(x)}</div>
    <div className="row">{y}</div>
  </StyledHint>
);
function LineChartFactory() {
  const LineChart = ({
    width,
    height,
    // yDomain,
    // hintFormat,
    // hoveredDP,
    margin,
    lineChart,
    brushing,
    isEnlarged,
    isRanged,
    color,
    // data,
    // onMouseMove,
    children
  }) => {
    const {xDomain, series} = lineChart;
    const [hoveredDP, onMouseMove] = useState(null);
    const hintFormatter = useMemo(
      () => {
        return getTimeWidgetHintFormatter(xDomain);
      },
      [xDomain]
    );

    const brushData = useMemo(
      () => {
        return [{x: series[0].x, y: yDomain[1], customComponent: () => children}];
      },
      [series, yDomain]
    );

    return (
      <LineChartWrapper>
        <XYPlot width={width} height={height} margin={{...margin, bottom: 12}}>
          <LineSeries strokeWidth={2} color={color} data={series} onNearestX={onMouseMove} />
          <MarkSeries data={hoveredDP ? [hoveredDP] : []} color={color} size={3} />
          <CustomSVGSeries data={brushData} />
          {hoveredDP ? (
            <Hint value={hoveredDP}>
              <HintContent {...hoveredDP} format={val => moment.utc(val).format(hintFormatter)} />
            </Hint>
          ) : null}
        </XYPlot>
      </LineChartWrapper>
    );
  };
  return LineChart;
}

export default LineChartFactory;
