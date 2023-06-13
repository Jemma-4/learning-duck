<template>
  <div class="container">
    <van-sticky :offset-top="0" class="top">
      <van-row class="top-tochose" type="flex" align="bottom">
        <!-- 第一个按钮为添加番茄钟/长期计划/待办清单的功能 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/back-white.png')"
            class="button"
            @click="goBack()"
          />
        </van-col>
        <!-- 会以弹窗的形式展现一些用户信息 -->
        <van-col span="18">
          <div class="title">{{groupName}}</div>
        </van-col>
        <!-- 会跳转到自习室相关页面 -->
      </van-row>
    </van-sticky>

    <div id="user-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          success-text="刷新成功"
          @load="onLoad"
        >
          <div class="describe">圈主</div>
          <div class="masterList">
            <div v-for="(item,id) in memberList" :key="id" @click.stop="choseThis(item.userid)">
              <div v-if="id==0">
                <van-row class="user-info-row" type="flex" justify="start" align="center">
                  <van-col span="3">
                    <van-image :src="item.headImage" fit="cover" round class="user-info-img"></van-image>
                  </van-col>
                  <van-col span="17">
                    <van-row>
                      <van-col span="16">
                        <div class="user-info-name">{{item.username}}</div>
                      </van-col>
                      <van-col span="3">
                        <div class="user-info-master">圈主</div>
                      </van-col>
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
              </div>
            </div>
          </div>
          <div class="describe">圈子成员</div>
          <div class="userList">
            <div v-for="(item,id) in memberList" :key="id" @click.stop="choseThis(item.userid)">
              <div v-if="id!=0">
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
          </div>
          <div style="height:5px;" />
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { get, post } from "../router/request.js";
import { Toast } from "vant";
import InvitationDetailList from "../views/InvitationDetailList.vue";

export default {
  name: "MemberList",
  data() {
    return {
      userId: 0,
      groupId: 0,
      groupName: "鸭鸭圈",
      memberList: [
        // {
        //   headImage: "https://img.yzcdn.cn/vant/cat.jpeg",
        //   username: "妮妮鸭",
        //   userid: 1,
        //   workNum: 10,
        //   fansNum: 300,
        //   isfollowed: true
        // },
        // {
        //   headImage: "https://img.yzcdn.cn/vant/cat.jpeg",
        //   username: "妮妮鸭",
        //   userid: 4,
        //   workNum: 10,
        //   fansNum: 300,
        //   isfollowed: true
        // },
        // {
        //   headImage: "https://img.yzcdn.cn/vant/cat.jpeg",
        //   username: "妮妮鸭",
        //   userid: 1000,
        //   workNum: 10,
        //   fansNum: 300,
        //   isfollowed: true
        // }
      ],
      loading: false,
      finished: false,
      refreshing: false,
      page: 0,
      maxNum: 0
    };
  },
  methods: {
    choseThis(val) {
      console.log("跳转到用户详情");
      this.$router.push("/user/" + this.userId + "/" + val);
    },
    goBack() {
      this.$router.go(-1);
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
        //对接：列表拉取
      if (this.refreshing) {
        this.memberList = [];
        this.page = 0;
        this.refreshing = false;
      }
      this.page += 1;
      get({
        url: "/api/getGroupMember",
        params: {
          userid: this.userId,
          groupid: this.groupId,
          page: this.page,
          num: 8 // 每页的条数
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 1) {
            this.maxNum = res.data.max;
            // 这里拿数据
            res.data.userList.forEach(element => {
              this.memberList.push(element);
            });
            this.loading = false;
          }
          if (this.memberList.length >= this.maxNum) {
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
      this.page = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
    this.groupId = this.$route.params.groupId;
  }
};
</script>

<style scoped>
.container {
  width: 375px;
}
.title {
  font-size: 20px;
  color: white;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
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

.userList {
  padding-top: 20px;
}
.masterList {
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

.user-info-master {
  height: 15px;
  line-height: 15px;
  text-align: center;
  font-size: 12px;
  color: white;
  margin-top: 4px;
  border-radius: 4px;
  background-color: rgba(255, 216, 0, 0.95);
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

.describe {
  padding-left: 15px;
  background-color:rgba(0,0,0,0.05);
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>