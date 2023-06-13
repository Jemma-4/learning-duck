<template>
  <div id="learning-detail">
    <!-- 顶部标签未吸顶+固定在顶部 返回 分享 退出圈子 -->
    <van-sticky :offset-top="0" class="top">
      <van-row class="top-tochose" type="flex" justify="start" align="bottom">
        <!-- 返回按钮 -->
        <van-col span="3">
          <van-button
            size="large"
            class="back-button"
            :icon="require('../assets/back-white.png')"
            @click="goBackClick()"
          ></van-button>
        </van-col>

        <!-- 页面title -->
        <van-col span="18" class="learning-name-label">
          <div>学习数据统计</div>
        </van-col>

        <!-- 分享按钮 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/share-white.png')"
            class="top-button"
          />
        </van-col>
      </van-row>
    </van-sticky>

    <div class="container">
      <!-- 累计专注信息展示卡片 -->
      <div class="focus-card">
        <van-row class="focus-card-title">累计专注</van-row>
        <van-row class="focus-card-info">
          <van-col span="6">
            <van-row class="focus-info-title">次数</van-row>
            <van-row class="focus-info-num">{{this.allTimes}}</van-row>
          </van-col>
          <van-col span="10">
            <van-row class="focus-info-title">时长</van-row>
            <van-row>
              <van-col>
                <div class="focus-info-num">{{this.allHour}}</div>
              </van-col>
              <van-col>
                <div class="focus-info-title-son">小时</div>
              </van-col>
              <van-col>
                <div class="focus-info-num">{{this.allMinute}}</div>
              </van-col>
              <van-col>
                <div class="focus-info-title-son">分钟</div>
              </van-col>
            </van-row>
          </van-col>
          <van-col span="8">
            <van-row class="focus-info-title">日均时长</van-row>
            <van-row class="focus-info-num">{{this.allAverage}}</van-row>
          </van-col>
        </van-row>
      </div>

      <div class="blank" />

      <!-- 今日专注信息展示卡片 -->
      <div class="focus-card">
        <van-row class="focus-card-title">今日专注</van-row>
        <van-row class="focus-card-info">
          <van-col span="6">
            <van-row class="focus-info-title">次数</van-row>
            <van-row class="focus-info-num">{{this.todayTimes}}</van-row>
          </van-col>
          <van-col span="10">
            <van-row class="focus-info-title">时长</van-row>
            <van-row>
              <van-col>
                <div class="focus-info-num">{{this.todayHour}}</div>
              </van-col>
              <van-col>
                <div class="focus-info-title-son">小时</div>
              </van-col>
              <van-col>
                <div class="focus-info-num">{{this.todayMinute}}</div>
              </van-col>
              <van-col>
                <div class="focus-info-title-son">分钟</div>
              </van-col>
            </van-row>
          </van-col>
          <van-col span="8">
            <van-row class="focus-info-title">放弃次数</van-row>
            <van-row class="focus-info-num">{{this.todayFail}}</van-row>
          </van-col>
        </van-row>
      </div>
      
      <div class="blank" />

      <div class="chart-list">
        <div class="single-chart">
          <focusDistribution />
        </div>
      </div>

      <div class="blank" />

      <div class="chart-list">
        <div class="single-chart">
          <workTime />
        </div>
      </div>

      <div class="blank" />


      <div class="chart-list">
        <div class="single-chart">
          <failReasonChart />
        </div>
      </div>

      <div class="blank" />

      <div class="chart-list">
        <div class="single-chart">
          <lineChart />
        </div>
      </div>
    </div>

    <div class="blank" />
    <div class="blank" />
    <div class="blank" />

  </div>
</template>

<script>
import failReasonChart from "../components/failReasonChart.vue";
import focusDistribution from "../components/FocusDistribution.vue";
import lineChart from "../components/lineChart.vue";
import workTime from "../components/WorkTime.vue";
import { get } from "../router/request.js";
import { Toast } from "vant"

export default {
  name: "LearningDetail",
  components: {
    failReasonChart,
    focusDistribution,
    lineChart,
    workTime
  },
  data() {
    return {
      userId:0,
      allTimes: 0,
      allHour: 0,
      allMinute: 0,
      allAverage: 0,
      todayTimes: 0,
      todayHour: 0,
      todayMinute: 0,
      todayFail: 0
    };
  },
  methods: {
    goBackClick() {
      this.$router.go(-1);
    }
  },
  mounted(){
    this.userId=this.$route.params.userId;
    get({
      url: "/api/getLearningDetail",
      params: {
        userid: this.userId,
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.ok == 1) {
          this.allTimes = res.data.allTimes;
          this.allHour = res.data.allHour;
          this.allMinute = res.data.allMinute;
          this.allAverage = res.data.allAverage;
          this.todayTimes = res.data.todayTimes;
          this.todayHour = res.data.todayHour;
          this.todayMinute = res.data.todayMinute;
          this.todayFail = res.data.todayFail;
        }else{
          Toast(res.data.msg);
        }
      })
      .catch((res) => {
        Toast("获取Tag详情失败");
      });
  }
};
</script>

<style scoped>
#learning-detail {
  background-color: #ffc800;
}

.container {
  padding-left: 20px;
  padding-right: 20px;
  width: 335px;
  padding-top: 10px;
}

.van-icon__image {
  width: 25px;
  height: 25px;
}
.top{
  background-color:#ffc800;
  height:90px;
}
.top-tochose{
  background-color:#ffc800;
  height:90px;
}

.back-button {
  border: 0px;
  height: 50px;
  padding-left: 0px;
  background-color: rgba(0, 0, 0, 0);
}

.top-button {
  border: 0px;
  height: 50px;
  padding-left: 0px;
  background-color: rgba(0, 0, 0, 0);
}

.learning-name-label {
  font-size: 18px;
  color: white;
  line-height: 50px;
  text-align: center;
}

.chart-list {
  background-color: #ffc800;
}

.block {
  height: 1000px;
  background-color: #ffc800;
}

.focus-card {
  background-color: white;
  border-radius: 10px;
}

.single-chart{
  background-color:white;
  padding-top:10px;
  padding-bottom:10px;
  padding-left:0px;
  padding-right:0px;
  width:335px;
  border-radius: 10px;
}

.focus-card-title {
  font-size: 16px;
  color: #ffc800;
  padding-left: 15px;
  padding-top: 15px;
}

.focus-card-info {
  font-size: 12px;
  color: #ffc800;
  padding-left: 80px;
 padding-top: 5px;
}

.focus-info-title {
  font-size: 12px;
}

.focus-info-title-son {
  font-size: 12px;
  padding-top: 14px;
}

.focus-info-num {
  font-size: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.blank {
  height: 15px;
  background-color: rgba(0, 0, 0, 0);
}
</style>