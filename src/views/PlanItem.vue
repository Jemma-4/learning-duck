<template>
  <div id="plan-item" v-if="isdeleted">
    <div class="blank-space" />
    <div class="container">
      <van-swipe-cell class="card-cell" :before-close="beforeClose">
        <div
          class="plan-card"
          :style="{backgroundImage:'url(' + require('../assets/background/'+random+'.png') + ')'}"
        >
          <van-row style="height:80px;" type="flex" align="center" justify="start">
            <van-col span="18">
              <van-row>
                <div class="plan-title-label">{{this.title}}</div>
              </van-row>
              <van-row>
                <van-col span="11">
                  <div class="plan-runtime-label">{{this.runtime}}分钟 - 计划</div>
                </van-col>
                <van-col span="3">
                  <div class="plan-cicrle-process">
                    <van-circle
                      v-model="currentRate"
                      :rate="rate"
                      :clockwise="false"
                      size="90%"
                      layer-color="#ffc800"
                      color="rgba(255,255,255,0.65)"
                      :text="text"
                      :stroke-width="100"
                    />
                  </div>
                </van-col>
                <van-col span="7">
                  <div class="plan-process-label">{{this.studytime}}/{{this.targettime}}分钟</div>
                </van-col>
              </van-row>
            </van-col>
            <van-col span="6" type="flex" align="center" justify="end">
              <div class="plan-left-label">还剩{{this.leftday}}天</div>
              <van-button class="plan-start-button" @click="startclick()">开始</van-button>
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
  name: "PlanItem",
  data() {
    return {
      title: "长期计划样例",
      planid: 10002,
      targettime: 100,
      studytime: 40,
      endtime: 12,
      alarmtime: 0,
      runtime: 25,
      relaxtime: 5,
      circulate: true,
      blackhouse: true,
      rate: 100,
      isdeleted: true,
      userId: 0
    };
  },
  props: {
    detail: {},
    // userId: 0
  },
  computed: {
    currentRate: {
      get() {
        if (this.targettime == 0) {
          return 0;
        } else {
          return (this.studytime / this.targettime) * 100;
        }
      },
      set(val) {
        //this.studytime=val*this.targettime
      }
    },
    text: function() {
      return this.currentRate.toFixed(0) + "%";
    },
    leftday() {
      return this.endtime;
    },
    random() {
      //计算属性，用于随机背景图
      let num = Math.floor(Math.random() * (7 - 1) + 1);
      return num.toString();
    }
  },
  methods: {
    startclick() {
      console.log("长期计划开始");
      this.$router.push("/clock/plan-" + this.planid);
    },
    beforeClose() {
      //对接:this.planid删除对接后端
      get({
        url: "/api/deleteLongPlan",
        params: {
          userid: this.userId,
          planid: this.planid
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.isdeleted = false;
            Toast("长期计划 " + this.planid + " 删除");
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(res => {
          Toast("长期计划 " + this.title + " 删除失败");
        });
    },
    getLeftDays(val) {
      let endDate = new Date(val);
      let startDate = new Date();
      let seconds = Math.abs(endDate.getTime() - startDate.getTime());
      let days = parseInt(seconds / (24 * 60 * 60 * 1000));
      return days;
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
    if (this.detail) {
      this.title = this.detail.title;
      this.planid = this.detail.planid;
      this.targettime = this.detail.targettime;
      this.studytime = this.detail.studytime;
      let endDate = this.detail.endtime;
      this.endtime = this.getLeftDays(endDate);
      this.alarmtime = this.detail.alarmtime;
      this.runtime = this.detail.focustime;
      this.relaxtime = this.detail.relaxtime;
      this.circulate = this.detail.circulate;
      this.blackhouse = this.detail.blackhouse;
      this.rate = this.targettime;
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
.plan-card {
  width: 355px;
  height: 80px;
  color: white;
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
.plan-title-label {
  text-align: left;
  font-size: 18px;
  font-family: "黑体";
  padding-left: 25px;
  padding-top: 10px;
  height: 35px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}
.plan-runtime-label {
  text-align: left;
  font-size: 12px;
  padding-left: 25px;
  height: 25px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
  line-height: 25px;
}
.plan-cicrle-process {
  text-align: left;
  font-size: 8px;
  height: 25px;
  color: white;
}
.van-circle >>> .van-circle__text {
  color: white;
  font-size: 1px;
}
.plan-process-label {
  text-align: left;
  font-size: 12px;
  height: 25px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
  line-height: 25px;
}
.plan-start-button {
  background-color: rgba(0, 0, 0, 0);
  height: 30px;
  top: -10px;
  border: 0px;
  font-size: 20px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}
.plan-left-label {
  text-align: left;
  font-size: 12px;
  padding-left: 25px;
  height: 25px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
  line-height: 25px;
}
</style>
