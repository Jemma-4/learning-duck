<template>
  <div id="FocusDistribution">
    <van-tabs type="card" color="#ffc800" @click="onClick">
      <van-tab title="日"></van-tab>
      <van-tab title="周"></van-tab>
      <van-tab title="月"></van-tab>
    </van-tabs>
    <div id="focus_chart" style="width: 100%;height:300px;"></div>
    <div style="font-size:18px;text-align: center">总计：{{hour}}小时{{minute}}分钟</div>
  </div>
</template>
<script>
import { get } from "../router/request.js";
export default {
  name: "FocusDistribution",
  data() {
    return {
      chart_data: null,
      hour: 0,
      minute: 0,
      userId: 0,
    };
  },
  methods: {
    drawChart(data) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("focus_chart"));
      // 指定图表的配置项和数据
      let option = {
        color: ["#fb7293", "#ffdb5c", "#ff9f7f"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}分钟 ({d}%)"
        },
        series: [
          {
            name: "专注时长分布",
            type: "pie",
            radius: [0, 90],
            hoverAnimation: false,
            label: {
              normal: {
                position: "inner",
                fontSize: 16,
                fontWeight: 400,
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.name;
                  } else {
                    return "";
                  }
                }
              }
            },
            data: data.data
          },
          {
            avoidLabelOverlap: true,
            name: "专注时长分布",
            type: "pie",
            radius: [0, 90],
            label: {
              normal: {
                position: "outer",
                fontSize: 15,
                fontWeight: 400,
                formatter: "{c}分钟"
              }
            },
            data: data.data
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 点击标签
    onClick(name, title) {
      if (name == 0) {
        this.drawChart(this.chart_data.day);
        this.hour = this.chart_data.day.hour;
        this.minute = this.chart_data.day.minute;
      } else if (name == 1) {
        this.drawChart(this.chart_data.week);
        this.hour = this.chart_data.week.hour;
        this.minute = this.chart_data.week.minute;
      } else if (name == 2) {
        this.drawChart(this.chart_data.month);
        this.hour = this.chart_data.month.hour;
        this.minute = this.chart_data.month.minute;
      }
    }
  },
  mounted() {
    this.userId = this.$route.params.userId;
    //   接收的数据格式
    this.chart_data = {
      day: {
        data: [
          { value: 20, name: "番茄钟" },
          { value: 30, name: "定计划" },
          { value: 25, name: "自习室" }
        ],
        hour: 1,
        minute: 15
      },
      week: {
        data: [
          { value: 0, name: "番茄钟" },
          { value: 0, name: "定计划" },
          { value: 75, name: "自习室" }
        ],
        hour: 3,
        minute: 45
      },
      month: {
        data: [
          { value: 100, name: "番茄钟" },
          { value: 80, name: "定计划" },
          { value: 75, name: "自习室" }
        ],
        hour: 4,
        minute: 35
      }
    };
    get({
      url: "/api/getFocusDistribution?userid=" + this.userId
    })
      .then(res => {
        if (res.data.ok == 0) {
          this.hour = this.chart_data.day.hour;
          this.minute = this.chart_data.day.minute;
          this.drawChart(this.chart_data.day);
          return;
        }
        this.chart_data = res.data;
        this.hour = this.chart_data.day.hour;
        this.minute = this.chart_data.day.minute;
        this.drawChart(this.chart_data.day);
      })
      .catch(res => {
        this.hour = this.chart_data.day.hour;
        this.minute = this.chart_data.day.minute;
        this.drawChart(this.chart_data.day);
      });
  }
};
</script>

