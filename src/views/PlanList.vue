<template>
  <div class="plan-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        success-text="刷新成功"
        @load="onLoad"
      >
        <div v-for="(item,i) in planList" :key="i">
          <clock-item v-if="item.type==1" :detail="item.detail" :userId="userId" />
          <plan-item v-if="item.type==3" :detail="item.detail" :userId="userId" />
          <todo-item v-if="item.type==2" :detail="item.detail" :userId="userId" />
          <div v-if="item.type==4" class="tip">还没任何学习计划，快创建一个吧~~</div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ClockItem from "../views/ClockItem.vue";
import PlanItem from "../views/PlanItem.vue";
import TodoItem from "../views/TodoItem.vue";
import { get, post } from "../router/request.js";

export default {
  name: "PlanList",
  components: {
    ClockItem,
    PlanItem,
    TodoItem
  },
  props: {
    needRefresh: false
  },
  data() {
    return {
      planList: [],
      userId: 0,
      loading: false,
      finished: false,
      refreshing: false,
      planPage: 0,
      maxNum: 0
    };
  },
  methods: {
    //下拉刷新列表的两个响应函数
    onLoad() {
      //对接：列表拉取,删除testElement
      if (this.refreshing) {
        this.planList = [];
        this.refreshing = false;
      }
      this.planPage += 1;
      get({
        url: "/api/getAllPlanList",
        params: {
          userid: this.userId,
          page: this.planPage
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.maxNum = res.data.max;
            res.data.data.forEach(element => {
              this.planList.push(element);
            });
            this.loading = false;
          }
          if (this.planList.length >= this.maxNum) {
            this.finished = true;
          }
        })
        .catch(res => {
          this.finished = true;
        });
    },
    onRefresh() {
      // 清空列表数据
      console.log("refresh");
      this.planList = [];
      this.finished = false;
      this.planPage = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
      console.log(this.planList);
    }
  },
  watch: {
    needRefresh: {
      handler: function(val, oldval) {
        this.onRefresh();
        console.log("success");
      }
    }
  },
  mounted(){
    this.userId = this.$cookies.get("userid");
  }
};
</script>

<style scoped>

.tip {
  height: 500px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 500px;
}
</style>