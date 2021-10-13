import React         from 'react';
import render        from 'react-dom';
import Chart         from './RenkoChart';
import RenkoChart    from "./RenkoChart";
import {getData}     from "./utils";
import {TypeChooser} from "react-stockcharts/lib/helper";


class ChartComponent extends React.Component {
    componentDidMount () {
        getData ().then (data => {
            this.setState ({data})
        });
    }

    render () {
        if (this.state == null) {
            return <div>Loading...</div>
        } else {
            return (<TypeChooser>
                <RenkoChart type="svg" data={this.state.data}/>;
            </TypeChooser>);
        }
    }
}

export default ChartComponent;
