import React from 'react';
import PropTypes from 'prop-types';
import { timeFormat } from 'd3-time-format';
import { scaleTime } from 'd3-scale';
import { curveMonotoneX, curveNatural, curveLinear } from 'd3-shape';
import {
  CrossHairCursor,
  MouseCoordinateY,
  MouseCoordinateX,
  PriceCoordinate,
} from 'react-stockcharts/lib/coordinates';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { LineSeries, AreaSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { LabelAnnotation, Label, Annotate } from 'react-stockcharts/lib/annotation';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';
import { createVerticalLinearGradient, hexToRGBA } from 'react-stockcharts/lib/utils';
import _ from 'lodash';
import { format } from 'd3-format';
import { formatCurrency } from '../../../utils';
import { CurrentCoordinate } from '../../Common';

const PriceChart = props => {
  const { type, data: initialData, ratio, width } = props;

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => new Date(d.time));
  let { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData);

  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 70)]);

  const xExtents = [start, end];

  const zoomEvent = false;
  const min = _.minBy(data, function(o) {
    return o.low;
  }).low;
  const max = _.maxBy(data, function(o) {
    return o.high;
  }).high;

  const panEvent = false;
  const clamp = false;
  const zoomAnchor = function(e) {};

  return (
    <ChartCanvas
      height={180}
      width={width - 120}
      seriesName={''}
      margin={{
        left: 0,
        right: 40,
        top: 0,
        bottom: 0,
      }}
      type={type}
      ratio={ratio}
      data={data}
      panEvent={panEvent}
      zoomEvent={zoomEvent}
      clamp={clamp}
      zoomAnchor={zoomAnchor}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
    >
      <Chart id={1} height={180} yExtents={[d => [d.high, d.low]]}>
        <YAxis axisAt="right" orient="right"
          ticks={2}
          tickFormat={format('$.2f')}
          innerTickSize={-width+160}
          tickStrokeDasharray={'Solid'}
          tickStrokeOpacity={0.3}
          tickStrokeWidth={1}
          tickStroke={"rgba(255, 255, 255, 0.52)"}
          fontWeight={300}
          fontSize={11}
          strokeWidth={0}
          fontFamily={"-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif"}
        />
        <MouseCoordinateX
          opacity={1}
          at="bottom"
          orient="bottom"
          dx={180}
          fill="rgba(0,0,0,0)"
          textFill="rgba(255, 255, 255, 0.52)"
          opacity={1}
          displayFormat={timeFormat('%a, %b %d')}
          fontSize={11}
          fontFamily={"-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif"}
        />

        <AreaSeries
          yAccessor={d => d.close}
          stroke="#17eef4"
          fill="rgba(23, 238, 244, 0.2)"
          strokeWidth={2}
          interpolation={curveLinear}
        />
        <CurrentCoordinate displayFormat={format('$.2f')} r={3} yAccessor={d => d.close} fill={'#FFF'} />
      </Chart>

      <CrossHairCursor ratio={ratio} stroke="#FFFFFF" />
    </ChartCanvas>
  );
};

export default fitWidth(PriceChart);