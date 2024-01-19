import React from 'react';
import ReactApexChart from 'react-apexcharts';

type SeriesData = {
  x: string;
  y: [number, number];
  goals?: Array<{
    name: string;
    value: number;
    strokeColor: string;
  }>;
};

type Series = {
  name: string;
  data: SeriesData[];
};

type PreTrainingState = {
  series: Series[];
  options: any; // You can define a more specific type for ApexCharts options if needed
};

class PreTraining extends React.Component<{}, PreTrainingState> {
  constructor(props: {}) {
    super(props);

    this.state = {
        series: [
          {
            name: "Center 1",
            data: [
              {
                x: "Mobilization and Needs Assessment",
                y: [
                  new Date("2019-03-05").getTime(),
                  new Date("2019-03-08").getTime(),
                ],
              },
              {
                x: "Pre-training",
                y: [
                  new Date("2019-03-02").getTime(),
                  new Date("2019-03-05").getTime(),
                ],
              },
              {
                x: "Registration",
                y: [
                  new Date("2019-03-05").getTime(),
                  new Date("2019-03-07").getTime(),
                ],
              },
              {
                x: "Content Development",
                y: [
                  new Date("2019-03-03").getTime(),
                  new Date("2019-03-09").getTime(),
                ],
              },
              {
                x: "Resource Allocation",
                y: [
                  new Date("2019-03-08").getTime(),
                  new Date("2019-03-11").getTime(),
                ],
              },
              {
                x: "Research",
                y: [
                  new Date("2019-03-08").getTime(),
                  new Date("2019-03-11").getTime(),
                ],
              },
              {
                x: "TTT",
                y: [
                  new Date("2019-03-08").getTime(),
                  new Date("2019-03-11").getTime(),
                ],
              },
              {
                x: "Center Set-up",
                y: [
                  new Date("2019-03-08").getTime(),
                  new Date("2019-03-11").getTime(),
                ],
              },
            ],
          },
          {
            name: "Center 2",
            data: [
              {
                x: "Mobilization and Needs Assessment",
                y: [
                  new Date("2019-03-02").getTime(),
                  new Date("2019-03-05").getTime(),
                ],
              },
              {
                x: "Pre-training",
                y: [
                  new Date("2019-03-06").getTime(),
                  new Date("2019-03-16").getTime(),
                ],
                goals: [
                  {
                    name: "Break",
                    value: new Date("2019-03-10").getTime(),
                    strokeColor: "#CD2F2A",
                  },
                ],
              },
              {
                x: "Registration",
                y: [
                  new Date("2019-03-03").getTime(),
                  new Date("2019-03-07").getTime(),
                ],
              },
              {
                x: "Content Development",
                y: [
                  new Date("2019-03-20").getTime(),
                  new Date("2019-03-22").getTime(),
                ],
              },
              {
                x: "Resource Allocation",
                y: [
                  new Date("2019-03-10").getTime(),
                  new Date("2019-03-16").getTime(),
                ],
              },
              {
                x: "Research",
                y: [
                  new Date("2019-03-03").getTime(),
                  new Date("2019-03-07").getTime(),
                ],
              },
              {
                x: "TTT",
                y: [
                  new Date("2019-03-20").getTime(),
                  new Date("2019-03-22").getTime(),
                ],
              },
              {
                x: "Center Set-up",
                y: [
                  new Date("2019-03-10").getTime(),
                  new Date("2019-03-16").getTime(),
                ],
              },
            ],
          },
        ],
        options: {
          chart: {
            height: 450,
            type: "rangeBar",
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: "80%",
            },
          },
          xaxis: {
            type: "datetime",
          },
          stroke: {
            width: 1,
          },
          fill: {
            type: "solid",
            opacity: 0.6,
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
          },
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
            type="rangeBar"
            height={450}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default PreTraining;
