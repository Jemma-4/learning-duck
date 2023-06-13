<template>
  <div id="invitaion-detail-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        success-text="刷新成功"
        @load="onLoad"
      >
        <div v-for="(item,i) in invitationList" :key="i"  @click="choseThis(item.workid)">
          <invitation-detail :detail="item" :myId="userId" :myName="userName" />
          <div style="height:5px;" />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import InvitationDetail from "../views/InvitationDetail.vue";
import { get, post } from "../router/request.js";

export default {
  name: "InvitationDetailList",
  components: {
    InvitationDetail
  },
  props: {//对接
    // userId: 0,
    url:"",
    type:0,
    para:"",
  },
  data() {
    return {
      userId: 0,
      invitationList: [],
      userName: "可达鸭",
      loading: false,
      finished: false,
      refreshing: false,
      invitationPage: 0,
      maxNum: 0
    };
  },
  methods: {
    choseThis(val) {
      console.log("跳转到帖子详情");
      this.$router.push("/invitation/" + this.userId + "/" + val);
    },
    //下拉刷新列表的两个响应函数
    onLoad() {
      //对接：列表拉取
      if (this.refreshing) {
        this.invitationList = [];
        this.refreshing = false;
      }
      this.invitationPage += 1;
      get({
        url: "/api/" + this.url,
        params: {
          userid: this.userId,
          keyword: this.para,
          para: this.para,
          page: this.invitationPage,
          num: 5, // 每页的条数
          type: this.type // 我加入的圈子所有帖子
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.maxNum = res.data.max;
            // 这里拿数据
            res.data.workList.forEach(element => {
              this.invitationList.push(element);
            });
            this.loading = false;
          }
          if (this.invitationList.length >= this.maxNum) {
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
      this.finished = false;
      this.invitationPage = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  },
  mounted(){
    this.userId = this.$cookies.get("userid");
  },
  watch: {
    $route: function(to, from) {
      this.invitationList = [];
      this.onRefresh();

      // console.log(this.userList);
    }
  }
};
</script>

<style scoped>
#invitaion-detail-list {
  background-color: rgba(0, 0, 0, 0.05);
}

.tip {
  height: 500px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 500px;
}
</style>