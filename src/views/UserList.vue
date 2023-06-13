<template>
  <div id="user-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        success-text="刷新成功"
        @load="onLoad"
      >
        <div class="userList">
          <div v-for="(item,id) in userList" :key="id" @click.stop="choseThis(item.userid)">
            <van-row class="user-info-row" type="flex" justify="start" align="center">
              <van-col span="3">
                <van-image :src="item.headImage" fit="cover" round class="user-info-img"></van-image>
              </van-col>
              <van-col span="16">
                <van-row>
                  <div class="user-info-name">{{item.username}}</div>
                </van-row>
                <van-row>
                  <van-col span="6">
                    <div class="user-info-num">作品{{item.workNum}}</div>
                  </van-col>
                  <van-col span="8">
                    <div class="user-info-num">粉丝{{item.fansNum}}</div>
                  </van-col>
                </van-row>
              </van-col>
              <van-col span="6">
                <van-button
                  v-show="!item.isfollowed"
                  class="user-follow-button"
                  @click.stop="followClick(item)"
                >关注</van-button>
                <van-button
                  v-show="item.isfollowed"
                  class="user-followed-button"
                  @click.stop="followClick(item)"
                >已关注</van-button>
              </van-col>
            </van-row>
            <div style="height:10px" />
            <div style="height:1px;background-color:rgba(0,0,0,0.05);" />
            <div style="height:10px" />
          </div>
        </div>
        <div style="height:5px;" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { get, post } from "../router/request.js";
import { Toast } from "vant";

export default {
  name: "UserList",
  props: {
    //对接
    // userId: 0,
    url: "", // getGroupMember 或 search
    type: 0,
    para: "" // 圈子id 或 搜索关键词
  },
  data() {
    return {
      userId: 0,
      userList: [
        // {
        //   headImage: "https://img.yzcdn.cn/vant/cat.jpeg",
        //   username: "妮妮鸭",
        //   userid: 1000,
        //   workNum: 10,
        //   fansNum: 300,
        //   isfollowed: true,
        // },
      ],
      loading: false,
      finished: false,
      refreshing: false,
      invitationPage: 0,
      maxNum: 0
    };
  },
  methods: {
    choseThis(val) {
      console.log("跳转到用户详情");
      this.$router.push("/user/" + this.userId + "/" + val);
    },
    followClick(item) {
      get({
        url: "/api/follow",
        params: {
          userid: this.userId,
          careid: item.userid
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            if (res.data.status == 1) {
              Toast("关注成功");
              item.isfollowed = true;
            } else {
              Toast("取消关注");
              item.isfollowed = false;
            }
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
    },

    //下拉刷新列表的两个响应函数
    onLoad() {
      console.log("hahaha"+this.para)
      //   //对接：列表拉取
      if (this.refreshing) {
        this.userList = [];
        this.invitationPage = 0;
        this.refreshing = false;
      }
      this.invitationPage += 1;

      get({
        url: "/api/" + this.url,
        params: {
          userid: this.userId,
          groupid: this.para,
          keyword: this.para,
          type: 0,
          page: this.invitationPage,
          num: 8 // 每页的条数
        }
      })
        .then(res => {
          console.log("hahaha"+this.para)
          console.log(res.data);
          if (res.data.ok == 1) {
            this.maxNum = res.data.max;
            // 这里拿数据
            res.data.userList.forEach(element => {
              this.userList.push(element);
            });
            this.loading = false;
          }
          if (this.userList.length >= this.maxNum) {
            this.finished = true;
          }
        })
        .catch(res => {
          this.finished = true;
        });
    },
    onRefresh() {
      //   // 清空列表数据
      console.log("refresh");

      this.finished = false;
      this.invitationPage = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
  },
  watch: {
    $route: function(to, from) {
      this.userList = [];
      this.onRefresh();
      
      // console.log(this.userList);
    }
  }
};
</script>

<style scoped>
.userList {
  padding-top: 20px;
}

.user-info-img {
  height: 60px;
  width: 60px;
  margin-left: 10px;
}

.user-info-name {
  padding-left: 30px;
  height: 30px;
  font-size: 16px;
}

.user-follow-button {
  font-size: 12px;
  border: 0px;
  background-color: #ffc800;
  height: 26px;
  width: 70px;
  bottom: 10px;
  border-radius: 5px;
}

.user-followed-button {
  font-size: 12px;
  border: 0px;
  background-color: rgba(0, 0, 0, 0.25);
  color: white;
  height: 26px;
  width: 70px;
  bottom: 10px;
  border-radius: 5px;
}

.user-info-num {
  padding-left: 30px;
  height: 30px;
  font-size: 14px;
  color: gray;
  width: 100px;
}
</style>