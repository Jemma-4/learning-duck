<template>
  <div id="WorkTime">
    <div style="width:89%;font-size:16px;color:black;padding-left:55px;">月度工作时段分布： {{year}}年--{{month}}月</div>
    <div id="worktimechart" style="width: 89%;height:300px;padding-top:20px"></div>
  </div>
</template>

<script>
import { get } from "../router/request.js";
export default {
  name: "WorkTime",
  data() {
    return {
      data: null,
      year: 0,
      month: 0,
      userId: 0,
    };
  },

  methods: {
    drawChart(sdata) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("worktimechart")
      );
      // 指定图表的配置项和数据
      let option = {
        // title: {
        //   color:"#efeb23",
        //   fontSize:6,
        //   text: this.year + "-" + this.month,
        // },
        tooltip: {
          trigger: "item",
          show: true,
          formatter: "时长：{c} 分钟"
        },
        legend: {
          data: ["时长"]
        },
        grid: {
          right: 20,
          left: 60,
          top: 40,
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },

          data: [
            "0点",
            "",
            "2点",
            "",
            "4点",
            "",
            "6点",
            "",
            "8点",
            "",
            "10点",
            "",
            "12点",
            "",
            "14点",
            "",
            "16点",
            "",
            "18点",
            "",
            "20点",
            "",
            "22点",
            ""
          ]
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },

          splitLine: {
            show: false,

            lineStyle: {
              color: "#666",
              width: 1,
              type: "dashed"
            }
          },
          axisLabel: {
            formatter: "{value}分钟",
            name: "分钟",
            show: true,
            inside: false,
            color: "black"
          }
        },

        series: [
          {
            name: "时长",
            type: "bar",
            color: "#ffc800",
            data: sdata.data,
            itemStyle: {
              normal: {
                barBorderRadius:[20, 20, 20, 20],
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 12,
                    fontFamily : '微软雅黑',
                  },
                  formatter: this.zero_format()
                }
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    zero_format(){
	    return function (params) {
		    if (params.value > 0) {
          return params.value;
        } else {
          return '';
       }
	    }
    }
  },
  mounted() {
    this.userId = this.$route.params.userId;
    this.sdata = {
      //data: [5, "","",'','',20,'','', 72,'', 10,'', 10,'', 36],
      data: [],
      year: 2020,
      month: 7
    };
    get({
      url: "/api/getWorkTime?userid=" + this.userId
    })
      .then(res => {
        console.log("aaa");
        if (res.data['ok'] == 0) {
          this.year = this.sdata.year;
          this.month = this.sdata.month;
          this.drawChart(this.sdata);
          return;
        }
        this.sdata = res.data;
        this.year = this.sdata.year;
        this.month = this.sdata.month;
        this.drawChart(this.chart_data);
      })
      .catch(res => {
        this.year = this.sdata.year;
        this.month = this.sdata.month;
        this.drawChart(this.sdata);
      });
    this.year = this.sdata.year;
    this.month = this.sdata.month;
    this.drawChart(this.sdata);
  }
};
</script>
