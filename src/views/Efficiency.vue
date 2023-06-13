<template>
  <div id="efficiency" ref="container">
    <!-- 顶端按钮栏，一直固定在顶端 -->
    <van-sticky :offset-top="0" class="top">
      <van-row class="top-tochose" type="flex" justify="end" align="bottom">
        <!-- 第一个按钮为添加番茄钟/长期计划/待办清单的功能 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/addclock.png')"
            class="button"
            @click="addClockClick()"
          />
        </van-col>
        <!-- 会以弹窗的形式展现一些用户信息 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/info.png')"
            class="button"
            @click="showUserinfo()"
          />
        </van-col>
        <!-- 会跳转到自习室相关页面 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/selfstudy.png')"
            class="button"
            @click="goSelfStudy()"
          />
        </van-col>
      </van-row>
    </van-sticky>

    <div style="height:5px;" />
    <!-- 用于显示番茄钟和自习室等子页面 -->
    <router-view :needRefresh="needRefresh" />

    <!-- 该弹出层用于显示创建计划的用户交互窗口 -->
    <van-popup
      v-model="addClockShow"
      duration="0.3"
      closeable
      round
      close-icon-position="top-right"
      :close-icon="require('../assets/close.png')"
      class="add-clock-popup"
      @closed="closeSonMoreSet()"
      @click-overlay="closeSonMoreSet()"
    >
      <add-clock ref="addclock" @time-show="onTimeShow()" @add-show="onAddShow()" />
    </van-popup>

    <!-- 该弹出层用于选择截止日期1,2 -->
    <van-popup
      v-model="timeSelectShow"
      :overlay="false"
      position="bottom"
      :close-on-popstate="false"
      :safe-area-inset-bottom="true"
      duration="0.5"
      round
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择截止时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="timeConfirm()"
        @cancel="timeCancel()"
      />
    </van-popup>

    <!-- 这个用来展示一些用户相关的状态信息 -->
    <van-popup
      v-model="moreInfoShow"
      :overlay="false"
      position="top"
      closeable
      :safe-area-inset-bottom="true"
      duration="0.5"
      class="state-popup"
    >
      <div class="state-info">今日累计专注：{{this.todayFocus}}分钟</div>
      <van-button @click="goLearningDeatil()" class="state-button">查看统计数据</van-button>
      <div v-if="!inRoom" class="state-info">当前未进入自习室</div>
      <div v-if="inRoom" class="state-info">当前自习室：{{this.roomName}}</div>
    </van-popup>
  </div>
</template>

<script>
import AddClock from "../views/addClock.vue";
export default {
  name: "Efficiency",
  data() {
    return {
      addClockShow: false,
      timeSelectShow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      timeText: "",
      needRefresh: 0,
      moreInfoShow: false,
      todayFocus: 30,
      inRoom: false,
      roomName: "tjh鸭鸭圈",
      roomId: 1
    };
  },
  components: {
    AddClock
  },
  methods: {
    goSelfStudy() {
      //该函数点击跳转创建自习室子路由
      if (this.$route.path != "/selfstudy") {
        if (!this.inRoom) {
          this.$router.push("/selfstudy");
        } else {
          this.$router.push("/learningroom/" + this.roomId);
        }
      }
    },
    addClockClick() {
      //该函数表示点击显示设置计划弹出层
      this.addClockShow = true;
    },
    closeSonMoreSet() {
      this.$refs.addclock.refresh();
    },
    onTimeShow() {
      this.timeSelectShow = true;
    },
    onAddShow() {
      this.addClockShow = false;
      this.needRefresh += 1;
    },
    timeConfirm() {
      var date = this.currentDate;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      month = month > 9 ? month : "0" + month;
      strDate = strDate > 9 ? strDate : "0" + strDate;
      this.timeText = year + "-" + month + "-" + strDate;
      this.$refs.addclock.showSelectTime(this.timeText);
      this.timeSelectShow = false;
    },
    timeCancel() {
      this.timeSelectShow = false;
    },
    showUserinfo() {
      this.moreInfoShow = true;
    },
    goLearningDeatil() {
      this.$router.push("/learningdetail");
    }
  },
  mounted(){
    this.todayFocus = this.$cookies.get("studytime");
    this.inRoom = this.$cookies.get("inRoom") == '1' ? true : false;
    if(this.inRoom){
      this.roomName = this.$cookies.get("roomname");
      this.roomId = this.$cookies.get("roomid");
    }
  }
};
</script>

<style scoped>
.top {
  background-color: #ffc800;
  height: 90px;
}
.top-tochose {
  background-color: #ffc800;
  height: 90px;
}
.button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
}
.add-clock-popup {
  width: 300px;
}
.popup-time-selecter {
  width: 375px;
  height: 200px;
  background-color: white;
}

.state-popup {
  background-color: rgb(0, 0, 0, 0.5);
  padding-top: 35px;
}

.state-button {
  border: 0px;
  width: 375px;
  text-align: center;
  line-height: 50px;
  height: 50px;
  font-size: 18px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
}

.state-info {
  width: 375px;
  text-align: center;
  line-height: 50px;
  height: 50px;
  font-size: 18px;
  color: white;
}
</style>