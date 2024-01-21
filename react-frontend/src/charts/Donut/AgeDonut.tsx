import React from 'react';
import ReactApexChart from 'react-apexcharts';

class TrainerCountDonut extends React.Component<{}, { series: number[]; options: any; }> {
    constructor(props: {}) {
        super(props);

        this.state = {
            series: [10, 20, 10, 5],
            options: {
                chart: {
                    type: 'donut',
                },
                colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63'],
                labels: ['25-30', '30-45','45-60','60-75'],
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        return opts.w.config.series[opts.seriesIndex]
                    },
                    dropShadow: {
                        enabled: false
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: '100%'
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
                        height="160"
                    />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}

export default TrainerCountDonut;
