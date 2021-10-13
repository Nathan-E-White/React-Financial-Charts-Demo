/*  Imports --- React Imports */
import React                                                 from 'react';
import PropTypes                                             from 'prop-types';

/*  Imports --- D3 Imports */
import {format}                                              from 'd3-format';
import {timeFormat}                                          from 'd3-time-format';

/*  Imports --- React Financial Charts */
import {Chart, ChartCanvas}                                  from 'react-financial-charts';
import {BarSeries, RenkoSeries}                              from 'react-financial-charts';
import {XAxis, YAxis}                                        from "react-financial-charts";
import {CrossHairCursor, MouseCoordinateX, MouseCoordinateY} from "react-financial-charts";
import {discontinuousTimeScaleProvider}                      from "react-financial-charts";
import {OHLCTooltip}                                         from "react-financial-charts";
import {renko}                                               from 'react-financial-charts';
import {last}                                                from 'react-financial-charts';
import {fitWidth}                                            from "react-stockcharts/lib/helper";


class RenkoChart extends React.Component {

    constructor (props) {
        super (props);
        this.saveNode = this.saveNode.bind (this);
        this.resetYDomain = this.resetYDomain.bind (this);
        this.handleReset = this.handleReset.bind (this);
    }

    componentWillMount () {
        this.setState ({
                           suffix: 1
                       });
    }

    saveNode (node) {
        this.node = node;
    }

    resetYDomain () {
        this.node.resetYDomain ();
    }

    handleReset () {
        this.setState ({
                           suffix: this.state.suffix + 1
                       });
    }

    render () {
        const renkoCalculator = renko ();
        const {type, data: initialData, width, ratio} = this.props;
        const calculatedData = renkoCalculator (initialData);
        const xScaleProvider = discontinuousTimeScaleProvider
            .inputDateAccessor (d => d.date);

        const {data, xScale, xAccessor, displayXAccessor} = xScaleProvider (calculatedData);

        const start = xAccessor (last (data));
        const end = xAccessor (data[Math.max (0, data.length - 150)]);
        const xExtent = [start, end];

        return (
            <ChartCanvas
                seriesName="NYSE:XOM"
                xScale={xScale}
                data={data}
                height={400}
                width={width}
                ratio={ratio}
                margin={{left: 80, right: 80, top: 10, bottom: 30}}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                xExtents={xExtent}
            >
                <Chart id={1}
                       yExtents={d => [d.high, d.low]}
                       padding={{top: 10, bottom: 20}}
                >
                    <XAxis axisAt="bottom" orient="bottom"/>
                    <YAxis axisAt="right" orient="right" ticks={5}/>
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format (".2f")}/>
                    <RenkoSeries/>
                    <OHLCTooltip origin={[-40, 0]}/>
                    <Chart id={2}
                           yExtents={d => d.volume}
                           height={150}
                           origin={(w, h) => [0, h - 150]}
                    >
                        <YAxis axisAt="left" orient="left" ticks={5} tickFormat={".2s"}/>
                        <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat ("%Y-%m-%d")}/>
                        <MouseCoordinateY at="left" orient="left" displayFormat={".4s"}/>
                        <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "FF0000"}/>
                    </Chart>
                    <CrossHairCursor/>
                </Chart>
            </ChartCanvas>
        );
    }
}

RenkoChart.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf (['svg', 'hybrid']).isRequired,
};

RenkoChart.defaultProps = {
    type: 'svg'
}

RenkoChart = fitWidth (RenkoChart);

export default RenkoChart;
