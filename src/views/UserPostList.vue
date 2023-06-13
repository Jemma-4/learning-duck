<template>
  <div id="list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        success-text="刷新成功"
        @load="onLoad"
      >
        <div class="postList">
          <div
            v-for="(item,id) in invitationList"
            :key="id"
            :class="id%2==0?'postItemLeft':'postItem'"
            @click="choseThis(item.workid)"
          >
            <UserPost :detail="item"/>
            <div style="height:10px" />
          </div>
        </div>
        <div style="height:5px;" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import UserPost from "../components/UserPost";
import { get, post } from "../router/request.js";

export default {
  name: "UserPostList",
  props:{
    myId:0,
  },
  components: {
    UserPost
  },
  data() {
    return {
      invitationList: [],
      userId: 0,
      loading: false,
      finished: false,
      refreshing: false,
      invitationPage: 0,
      maxNum: 0,
      type: 0
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
        url: "/api/getWorkList",
        params: {
          userid: this.myId,
          page: this.invitationPage,
          num: 5, // 每页的条数
          type: 4 // 该用户所有帖子
        }
      })
        .then(res => {
          console.log(res.data);
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
  }
};
</script>

<style scoped>
#list {
  background-color: rgba(0, 0, 0, 0.05);
  padding-top: 10px;
  padding-bottom: 10px;
}

.tip {
  height: 500px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 500px;
}

.postItemLeft {
  width: 172.5px;
  float: left;
  clear: left;
  padding-left: 10px;
}

.postItem {
  width: 172.5px;
  float: right;
  padding-right: 10px;
}
</style>