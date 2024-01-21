import React from 'react';
import ReactApexChart from 'react-apexcharts';

class TrainerCountDonut extends React.Component<{}, { series: number[]; options: any; }> {
    constructor(props: {}) {
        super(props);

        this.state = {
            series: [100, 60],
            options: {
                chart: {
                    type: 'donut',
                },
                colors: ['#2E93fA', '#546E7A'],
                labels: ['Male Trainers', 'Female Trainers'],
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
                        height="350"
                        width="350"
                    />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}

export default TrainerCountDonut;
