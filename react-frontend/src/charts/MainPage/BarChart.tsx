import React from "react";
import ReactApexChart from "react-apexcharts";

type BarChartData = number[];

type Series = {
  name: string;
  data: BarChartData;
};

type MainBarChartState = {
  series: Series[];
  options: any; // You can define a more specific type for ApexCharts options if needed
};

class MainBarChart extends React.Component<{}, MainBarChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "Trainers",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: "Trainees",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
        // {
        //   name: "Free Cash Flow",
        //   data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        // },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "Project 1",
            "Project 2",
            "Project 3",
            "Project 4",
            "Project 5",
            "Project 6",
            "Project 7",
            "Project 8",
            "Project 10",
          ],
        },
        yaxis: {
          title: {
            text: "Beneficiaries",
            style: {
              fontSize: "16px", // Increased y-axis label font size
            },
          },
        },
        legend: {
          labels: {
            style: {
              fontSize: "18px", // Increased legend font size
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          style: {
            fontSize: "14px", // Adjust the font size as needed
          },
          y: {
            formatter: function (val) {
              return val;
            },
          },
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
            type="bar"
            height={350}
            width={550}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default MainBarChart;
