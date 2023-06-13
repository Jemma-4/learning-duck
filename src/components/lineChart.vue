<template>
  <div id="lineChart" style="padding-top:20px;height:250px;">
    <div
      style="width:89%;font-size:16px;color:black;padding-left:55px;"
    >近一月的学习时间：</div>

    <div id="main" style="width: 90%;height:300px;"></div>
  </div>
</template>


<script>
import { get } from "../router/request.js";
// import json from "../components/heat.json";

export default {
  name: "TimeHeat",
  data() {
    return {
      userId: 0
    };
  },
  created() {},
  mounted() {
    // this.drawChart(json.data);
    this.userId = this.$route.params.userId;
    get({
      url: "/api/getLineChart?userid=" + this.userId
    })
      .then(res => {
        var json_data = res.data.data;
        console.log(json_data);
        this.drawChart(json_data);
      })
      .catch(res => {
        this.drawChart(json.data);
      });
  },
  methods: {
    drawChart(json_data) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));

      if (json_data == null) {
        myChart.showLoading({
          text: "loading",
          color: "#1890ff",
          textColor: "#000",
          maskColor: "rgba(100, 100, 0, 1.0)",
          zlevel: 0
        });
        return;
      }
      myChart.hideLoading();
      myChart.resize();
      // 绘制图表
      myChart.setOption({
        grid: {
          right: 25,
          left: 50,
          top: 40,
          bottom: 100
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none"
          },
          formatter: "{b0}: {c0}"
        },
        xAxis: {
          data: json_data.map(function(item) {
            return item[0];
          })
        },
        yAxis: {
          name: "时间（分钟）",
          nameTextStyle: {
            color: "rgba(225, 216, 0,1)",
            fontWeight: "bolder"
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "rgba(0,0,0,1)",
            interval: "auto",
            margin: 5
            // rotate: 30
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: {
          name: "时间",
          type: "line",
          symbol: "emptyCircle",
          symbolKeepAspect: false,
          hoverAnimation: true,

          symbolSize: 5,
          itemStyle: {
            color: "rgba(225, 216, 0,1)",
            borderColor: "rgba(225, 216, 0,1)",
            borderWidth: 2,
            borderType: "solid",
            shadowBlur: 10,
            shadowColor: "rgba(235, 201, 8, 1)",
            shadowOffsetX: 0,
            opacity: 1
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(225, 216, 0,0.8)" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(225, 216, 0,0.05)" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          smooth: 0.6,
          data: json_data.map(function(item) {
            return item[1];
          })
        }
      });
    }
  }
};
</script>