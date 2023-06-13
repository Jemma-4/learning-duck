<template>
  <div id="clock-item" v-if="isdeleted">
    <div class="blank-space" />
    <div class="container">
      <van-swipe-cell class="card-cell" :before-close="beforeClose">
        <div
          class="clock-card"
          :style="{backgroundImage:'url(' + require('../assets/background/'+random+'.png') + ')'}"
        >
          <van-row style="height:80px;" type="flex" align="center" justify="start">
            <van-col span="18">
              <van-row>
                <div class="clock-title-label">{{this.title}}</div>
              </van-row>
              <van-row>
                <div class="clock-runtime-label">{{this.runtime}}分钟</div>
              </van-row>
            </van-col>
            <van-col span="6" type="flex" align="center" justify="end">
              <van-button class="clock-start-button" @click="startclick()">开始</van-button>
            </van-col>
          </van-row>
        </div>
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" />
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { get, post } from "../router/request.js";
export default {
  name: "ClockItem",
  data() {
    return {
      title: "番茄钟样例",
      clockid: 10001,
      runtime: 25,
      relaxtime: 5,
      circulate: true,
      blackhouse: true,
      isdeleted: true,
      userId: 0,
    };
  },
  props: {
    detail: {},
    // userId: 0
  },
  computed: {
    random() {
      //计算属性，用于随机背景图
      let num = Math.floor(Math.random() * (7 - 1) + 1);
      return num.toString();
    }
  },
  methods: {
    startclick() {
      console.log("番茄钟开始");
      this.$router.push("/clock/clock-" + this.clockid);
    },
    beforeClose() {
      //对接:this.clockid删除对接后端
      get({
        url: "/api/deleteClock",
        params: {
          userid: this.userId,
          clockid: this.clockid
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.isdeleted = false;
            Toast("番茄钟 " + this.title + " 删除");
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(res => {
          Toast("番茄钟 " + this.title + " 删除失败");
        });
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
    if (this.detail) {
      this.title = this.detail.title;
      this.clockid = this.detail.clockid;
      this.runtime = this.detail.focustime;
      this.relaxtime = this.detail.relaxtime;
      this.circulate = this.detail.circulate;
      this.blackhouse = this.detail.blackhouse;
    } else {
      Toast("加载失败");
    }
  }
};
</script>

<style scoped>
.container {
  width: 367px;
  height: 89px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
}
.card-cell {
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 6px;
  padding-right: 6px;
}
.clock-card {
  width: 355px;
  height: 80px;
  border-radius: 6px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  background-color: rgba(158, 14, 14, 0.3);
}
.delete-button {
  left: 10px;
  height: 80px;
  width: 66px;
  background-color: rgba(255, 0, 0, 0.95);
  border: 0px;
}
.blank-space {
  height: 5px;
}
.clock-title-label {
  text-align: left;
  font-size: 18px;
  font-family: "黑体";
  padding-left: 25px;
  padding-top: 10px;
  height: 35px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}
.clock-runtime-label {
  text-align: left;
  font-size: 12px;
  padding-left: 25px;
  padding-top: 0px;
  height: 20px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}
.clock-start-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  font-size: 20px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}
</style>
