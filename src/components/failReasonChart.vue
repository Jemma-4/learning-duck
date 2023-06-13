<template>
  <div id="failReasonChart" style="padding-top:6px;">
    <div
      style="width:89%;font-size:16px;color:black;padding-left:55px;"
    >近一月失败原因：</div>
    <div id="fail-main" style="width: 100%;height:300px;"></div>
  </div>
</template>

<script>
import { get } from "../router/request.js";
//import json from "../components/failReason.json";

export default {
  name: "failReasonChart",
  data() {
    return {
      userId: 0
    };
  },
  created() {},
  mounted() {
    //this.drawChart(json.data);
    this.userId = this.$route.params.userId;
    get({
      url: "/api/getFailReasonChart?userid=" + this.userId
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
      let myChart = this.$echarts.init(document.getElementById("fail-main"));

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

      myChart.setOption({
        color: [
          "#37a2da",
          "#32c5e9",
          "#9fe6b8",
          "#ffdb5c",
          "#ff9f7f",
          "#fb7293",
          "#e7bcf3",
          "#8378ea"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{d}%"
        },
        legend: {
          orient: "horizontal",
          left: "left",
          data: json_data
        },
        label: {
          formatter: "{b}\n{c}次"
        },
        series: [
          {
            name: "失败原因",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            selectedMode: "single",
            selectedOffset: 10,
            hoverAnimation: false,
            //
            data: json_data
          }
        ]
      });
    }
  }
};
</script>