import React from 'react';
import ReactApexChart from 'react-apexcharts';

class AgeDonut extends React.Component<{}, { series: number[]; options: any; }> {
    constructor(props: {}) {
        super(props);

        this.state = {
            series: [44, 55],
            options: {
                chart: {
                    type: 'donut',
                },
                responsive: [{
                    breakpoint: 40,
                    options: {
                        chart: {
                            width: 20
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
        };
    }

    render() {
        return (
            <div>
                <div id="chart">
                    <ReactApexChart             
                        options={this.state.options}
                        series={this.state.series}
                        type="donut" 
                    />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}

export default AgeDonut;
