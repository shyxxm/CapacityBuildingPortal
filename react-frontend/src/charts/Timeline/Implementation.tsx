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

type ImpleChartState = {
  series: Series[];
  options: any; // You can define a more specific type for ApexCharts options if needed
};

class ImpleChart extends React.Component<{}, ImpleChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
        series: [
          {
            name: "Center 1",
            data: [
              {
                x: "Enrollment",
                y: [
                  new Date("2019-03-05").getTime(),
                  new Date("2019-03-08").getTime(),
                ],
              },
              {
                x: "Attendance",
                y: [
                  new Date("2019-03-02").getTime(),
                  new Date("2019-03-05").getTime(),
                ],
              },
              {
                x: "Curriculum Progress",
                y: [
                  new Date("2019-03-05").getTime(),
                  new Date("2019-03-07").getTime(),
                ],
              },
              {
                x: "Monitoring",
                y: [
                  new Date("2019-03-03").getTime(),
                  new Date("2019-03-09").getTime(),
                ],
              },
              {
                x: "Events",
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
                x: "Enrollment",
                y: [
                  new Date("2019-03-02").getTime(),
                  new Date("2019-03-05").getTime(),
                ],
              },
              {
                x: "Attendance",
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
                x: "Curriculum Progress",
                y: [
                  new Date("2019-03-03").getTime(),
                  new Date("2019-03-07").getTime(),
                ],
              },
              {
                x: "Monitoring",
                y: [
                  new Date("2019-03-20").getTime(),
                  new Date("2019-03-22").getTime(),
                ],
              },
              {
                x: "Events",
                y: [
                  new Date("2019-03-10").getTime(),
                  new Date("2019-03-16").getTime(),
                ],
              },
            ],
          },
          {
            name: "Center 3",
            data: [
              {
                x: "Enrollment",
                y: [
                  new Date("2019-03-10").getTime(),
                  new Date("2019-03-17").getTime(),
                ],
              },
              {
                x: "Attendance",
                y: [
                  new Date("2019-03-05").getTime(),
                  new Date("2019-03-09").getTime(),
                ],
                goals: [
                  {
                    name: "Break",
                    value: new Date("2019-03-07").getTime(),
                    strokeColor: "#CD2F2A",
                  },
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

export default ImpleChart;
