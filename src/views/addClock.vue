<template>
  <div id="addClock">
    <div class="head-background" />
    <div class="body-background" />
    <div class="body-content">
      <van-tabs
        v-model="active"
        swipeable
        type="card"
        class="tab-label"
        title-active-color="rgba(0,0,0,1)"
        color="rgba(255,255,255,1)"
        background="rgba(0,0,0,0.10)"
        :border="false"
        title-inactive-color="rgba(0,0,0,1)"
      >
        <van-tab title="番茄钟">
          <div class="tab-body-background" />
          <van-field
            v-model="title"
            :border="true"
            input-align="center"
            :center="true"
            placeholder="请输入具体目标"
            class="text-field"
          />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="slider-label">设置专注时间 : {{this.runtime}} 分钟</div>
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <van-slider v-model="runtime" :min="0" :max="60" class="slider" active-color="#ffb800" />
          <van-button v-show="!moresetshow" class="set-button" @click="setButtonClick()">更多设置</van-button>
          <div v-show="moresetshow" class="more-set">
            <div class="tab-body-background" />
            <div class="tab-body-background" />
            <van-cell center title="是否开启小黑屋功能">
              <template #right-icon>
                <van-switch v-model="isblackhouse" size="24" />
              </template>
            </van-cell>
            <van-cell center title="是否循环计时">
              <template #right-icon>
                <van-switch v-model="iscirculate" size="24" />
              </template>
            </van-cell>
            <van-cell-group>
              <van-field
                v-model="relaxtime"
                type="digit"
                label="单次休息时间"
                placeholder="默认为5分钟"
                input-align="right"
                :border="false"
              />
            </van-cell-group>
          </div>
          <div class="tab-body-background" />
          <van-button class="submit-button" @click="createClock()">确定</van-button>
        </van-tab>
        <van-tab title="定计划">
          <div class="tab-body-background" />
          <van-field
            v-model="title"
            :border="true"
            input-align="center"
            :center="true"
            placeholder="请输入具体目标"
            class="text-field"
          />
          <div class="ddl-row">
            我想在
            <van-button class="ddl-button" @click="timeChose()">{{this.endtime}}</van-button>之前
          </div>
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="targettime-row">
            <van-field
              :center="true"
              v-model="targettime"
              type="digit"
              label="一共完成"
              placeholder="填写完成量"
              input-align="right"
              :border="false"
              class="targettime-field"
            >
              <template #button>
                <van-button size="small" type="primary" class="targettime-button">分钟</van-button>
              </template>
            </van-field>
          </div>
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="slider-label">最后，设置单个番茄钟时间: {{this.runtime}} 分钟</div>
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <van-slider v-model="runtime" :min="0" :max="60" class="slider" active-color="#ffb800" />
          <van-button v-show="!moresetshow" class="set-button" @click="setButtonClick()">更多设置</van-button>
          <div v-show="moresetshow" class="more-set">
            <div class="tab-body-background" />
            <div class="tab-body-background" />
            <van-cell center title="是否开启小黑屋功能">
              <template #right-icon>
                <van-switch v-model="isblackhouse" size="24" />
              </template>
            </van-cell>
            <van-cell center title="是否循环计时">
              <template #right-icon>
                <van-switch v-model="iscirculate" size="24" />
              </template>
            </van-cell>
            <van-cell-group>
              <van-field
                v-model="relaxtime"
                type="digit"
                label="单次休息时间"
                placeholder="默认为5分钟"
                input-align="right"
                :border="false"
              />
            </van-cell-group>
          </div>
          <div class="tab-body-background" />
          <van-button class="submit-button" @click="createPlan()">确定</van-button>
        </van-tab>
        <van-tab title="写清单">
          <div class="tab-body-background" />
          <van-field
            v-model="title"
            :border="true"
            input-align="center"
            :center="true"
            placeholder="请输入具体目标"
            class="text-field"
          />
          <div class="ddl-row">
            我想在
            <van-button class="ddl-button" @click="timeChose()">{{this.endtime}}</van-button>之前完成
          </div>
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <div class="tab-body-background" />
          <textarea
            v-model="content"
            :border="true"
            maxlength="150"
            :center="true"
            autosize
            placeholder="请输入待办详细内容"
            class="content-field"
          />
          <div class="tab-body-background" />
          <van-button class="submit-button" @click="createTodo()">确定</van-button>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { get } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "AddClock",
  data() {
    return {
      active: 0,
      moresetshow: false, //控制是否显示更多设置
      userid: 0, //0,1,2
      title: "", //目标名称(0,1,2)
      content: "", //2
      createtime: "", //2
      runtime: 0, //0,1
      relaxtime: 5, //0,1
      targettime: 0, //1目标时间
      studytime: 0, //1
      endtime: "设置截止时间", //1,2
      finishtime: 0, //2
      isblackhouse: true, //0,1
      iscirculate: true //0,1
    };
  },

  methods: {
    setButtonClick() {
      this.moresetshow = this.moresetshow == false ? true : false;
    },
    refresh() {
      this.active = 0;
      this.moresetshow = false;
      this.title = "";
      this.runtime = 0;
      this.relaxtime = 5;
      this.endtime = "设置截止时间";
      this.content = "";
    },
    timeChose() {
      console.log("Here;");
      this.$emit("time-show", true);
    },
    showSelectTime(time) {
      this.endtime = time;
    },
    createClock() {
      if (this.title == "") {
        Toast("标题不能为空");
      } else if (this.runtime == 0) {
        Toast("专注时间不能为0");
      } else {
        //创建番茄钟接后端
        get({
          url: "/api/createClock",
          params: {
            userid: this.userid,
            title: this.title,
            focustime: this.runtime,
            relaxtime: this.relaxtime,
            circulate: this.iscirculate == true ? 1 : 0,
            blackhouse: this.isblackhouse == true ? 1 : 0
          }
        })
          .then(res => {
            console.log(res.data);
            if (res.data.ok == 0) {
              this.$notify({
                type: "warning",
                message: res.data.msg,
                duration: 600
              });
            } else {
              this.$notify({
                type: "success",
                message: "创建成功",
                duration: 500
              });
              this.$emit("add-show", false);
            }
          })
          .catch(res => {
            this.$notify({
              type: "danger",
              message: "服务器连接失败",
              duration: 600
            });
          });
      }
    },
    createPlan() {
      //创建长期计划接后端
      if (this.title == "") {
        Toast("标题不能为空");
      } else if (this.runtime == 0) {
        Toast("单个番茄钟时间不能为0");
      } else if (this.targettime == 0) {
        Toast("目标时间不能为0");
      } else {
        get({
          url: "/api/createLongPlan",
          params: {
            userid: this.userid,
            title: this.title,
            targettime: this.targettime,
            endtime: this.endtime,
            // alarmtime: this.
            focustime: this.runtime,
            relaxtime: this.relaxtime,
            circulate: Number(this.iscirculate),
            blackhouse: Number(this.iscirculate)
          }
        })
          .then(res => {
            console.log(res.data);
            if (res.data.ok == 0) {
              this.$notify({
                type: "warning",
                message: res.data.msg,
                duration: 600
              });
            } else {
              this.$notify({
                type: "success",
                message: "创建成功",
                duration: 500
              });
              this.$emit("add-show", false);
            }
          })
          .catch(res => {
            this.$notify({
              type: "danger",
              message: "服务器连接失败",
              duration: 600
            });
          });
      }
    },
    createTodo() {
      //创建待办清单
      //创建长期计划接后端
      if (this.title == "") {
        Toast("标题不能为空");
      } else {
        get({
          url: "/api/createTodo",
          params: {
            userid: this.userid,
            title: this.title,
            endtime: this.endtime,
            // alarmtime: this.
            content: this.content
          }
        })
          .then(res => {
            console.log(res.data);
            if (res.data.ok == 0) {
              this.$notify({
                type: "warning",
                message: res.data.msg,
                duration: 600
              });
            } else {
              this.$notify({
                type: "success",
                message: "创建成功",
                duration: 500
              });
              this.$emit("add-show", false);
            }
          })
          .catch(res => {
            this.$notify({
              type: "danger",
              message: "服务器连接失败",
              duration: 600
            });
          });
      }
    }
  },
  watch: {
    active() {
      this.refresh();
    }
  },
  mounted() {
    this.userid = this.$cookies.get("userid");
    this.refresh();
  }
};
</script>

<style scoped>
.head-background {
  background-color: #ffc800;
  width: 300px;
  height: 40px;
}
.body-background {
  background-color: white;
  width: 300px;
  height: 15px;
}
.tab-body-background {
  background-color: white;
  width: 280px;
  height: 8px;
}
.body-content {
  width: 300px;
  background-color: white;
}
.tab-label {
  left: 10px;
  width: 280px;
}
.text-field {
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: 6px;
  width: 200px;
  left: 40px;
  height: 30px;
  font-size: 13px;
}
.slider {
  left: 20px;
  width: 240px;
}
.slider-label {
  left: 40px;
  width: 240px;
  font-size: 14px;
  position: fixed;
}
.set-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  font-size: 14px;
  color: #ffc800;
  width: 120px;
  left: 80px;
}
.more-set {
  width: 280px;
}
.ddl-row {
  position: fixed;
  font-size: 14px;
  width: 240px;
  left: 40px;
}
.ddl-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  font-size: 14px;
  color: #ffc800;
  width: 120px;
}
.targettime-field {
  position: fixed;
  font-size: 14px;
  width: 255px;
  left: 25px;
  color: rgba(0, 0, 0, 1);
}
.targettime-button {
  background-color: white;
  color: #ffc800;
  border: 0px;
}
.content-field {
  width: 275px;
  left: 40px;
  border: 0px;
  font-size: 14px;
  max-height: 60px;
  overflow: hidden;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.01);
}
.submit-button {
  height: 30px;
  width: 150px;
  border: 0px;
  border-radius: 4px;
  font-size: 14px;
  left: 65px;
  bottom: 13px;
  background-color: rgba(255, 216, 0, 0.2);
}
</style>