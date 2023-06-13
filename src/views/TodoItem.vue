<template>
  <div id="todo-item" v-if="isdeleted">
    <div class="blank-space" />
    <div class="container">
      <van-swipe-cell class="card-cell" :before-close="beforeClose">
        <div
          class="todo-card"
          :style="{backgroundImage:'url(' + require('../assets/background/'+random+'.png') + ')'}"
        >
          <van-row style="height:80px;" type="flex" align="center" justify="start">
            <van-col span="18">
              <van-row>
                <div class="todo-title-label">{{this.title}}</div>
              </van-row>
              <van-row>
                <div class="todo-runtime-label">截止日期 : {{this.endday}} - 待办</div>
              </van-row>
            </van-col>
            <van-col span="6" type="flex" align="center" justify="end">
              <div class="todo-left-label">还剩{{this.leftday}}天</div>
              <van-button class="todo-start-button" @click="startclick()" v-if="!isfinished">完成</van-button>
              <van-button
                class="todo-start-button-completed"
                @click="startclick()"
                v-if="isfinished"
              >已完成</van-button>
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
  name: "TodoItem",
  data() {
    return {
      title: "待办清单样例",
      todoid: 0,
      createtime: 40,
      endtime: 12,
      isdeleted: true,
      isfinished: false,
      userId: 0,
      endDate:"",
    };
  },
  props: {
    detail: {},
    // userId: 0
  },
  computed: {
    leftday() {
      return this.endtime;
    },
    endday() {
      return this.endDate.substring(0,10);
    },
    level() {
      if (this.leftday < 3) {
        return 3;
      } else if (this.leftday < 7) {
        return 2;
      } else {
        return 1;
      }
    },
    random() {
      //计算属性，用于随机背景图
      let num = Math.floor(Math.random() * (7 - 1) + 1);
      return num.toString();
    }
  },
  methods: {
    startclick() {
      //对接:在此处写记录传给后端
      get({
        url: "/api/finishTodo",
        params: {
          isfinished: !this.isfinished ? 1 : 0,
          todoid: this.todoid
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.isfinished = !this.isfinished;
            if (this.isfinished) {
              Toast("待办 " + this.title + " 已完成");
            } else {
              Toast("待办 " + this.title + " 已恢复");
            }
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(res => {
          Toast("待办 " + this.title + " 完成失败");
        });
    },
    beforeClose() {
      //对接:this.todoid删除对接后端
      get({
        url: "/api/deleteTodo",
        params: {
          userid: this.userId,
          todoid: this.todoid
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.isdeleted = false;
            Toast("待办 " + this.title + " 删除");
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(res => {
          Toast("待办 " + this.title + " 删除失败");
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
      this.todoid = this.detail.todoid;
      this.isfinished = Boolean(this.detail.isfinished);
      this.endDate = this.detail.endtime;
      this.endtime = this.getLeftDays(this.endDate);
      this.createtime = this.detail.createtime;
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
.todo-card {
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
.todo-title-label {
  text-align: left;
  font-size: 18px;
  font-family: "黑体";
  padding-left: 25px;
  padding-top: 10px;
  height: 35px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}
.todo-runtime-label {
  text-align: left;
  font-size: 12px;
  padding-left: 25px;
  height: 25px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
  line-height: 25px;
}
.todo-start-button {
  background-color: rgba(0, 0, 0, 0);
  height: 30px;
  top: -10px;
  border: 0px;
  font-size: 20px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}
.todo-start-button-completed {
  background-color: rgba(0, 0, 0, 0);
  height: 30px;
  top: -10px;
  border: 0px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.15);
}
.todo-left-label {
  text-align: left;
  font-size: 12px;
  padding-left: 25px;
  height: 25px;
  color: white;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
  line-height: 25px;
}
</style>
