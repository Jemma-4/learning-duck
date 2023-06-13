<template>
  <div id="group-detail">
    <van-skeleton title :row="16" avatar class="skeleton" :loading="loading">
      <!-- 背景图，圈子头像图片 -->
      <van-image :src="groupImg" fit="cover" class="group-background-img"></van-image>

      <!-- 顶部标签未吸顶+固定在顶部 返回 分享 退出圈子 -->
      <van-sticky :offset-top="0" class="top" v-show="topShow">
        <van-row class="top-tochose" type="flex" justify="start" align="bottom">
          <!-- 返回按钮 -->
          <van-col span="3">
            <van-button
              size="large"
              class="back-button"
              :icon="require('../assets/back-white.png')"
              @click="goBackClick()"
            ></van-button>
          </van-col>

          <!-- 圈子的title -->
          <van-col span="12" offset="3" class="group-name-label">
            <div></div>
          </van-col>

          <!-- 分享按钮 -->
          <van-col span="3">
            <van-button
              round
              size="large"
              :icon="require('../assets/share-white.png')"
              class="top-button"
            />
          </van-col>
          <!-- 会跳出关注圈主的弹窗 -->
          <van-col span="3">
            <van-button
              round
              size="large"
              :icon="require('../assets/more-white.png')"
              class="top-button"
              @click="moreClick()"
            />
          </van-col>
        </van-row>
      </van-sticky>

      <!-- 顶部标签吸顶+固定在顶部 返回 分享 退出圈子 -->
      <van-sticky :offset-top="0" class="top" v-show="!topShow">
        <div class="top-fixed-background" />
        <van-image :src="groupImg" fit="cover" class="group-background-img-fixed"></van-image>
        <van-row class="top-tochose-fixed" type="flex" justify="start" align="bottom">
          <!-- 返回按钮 -->
          <van-col span="3">
            <van-button
              size="large"
              class="back-button"
              :icon="require('../assets/back-white.png')"
              @click="goBackClick()"
            ></van-button>
          </van-col>

          <!-- 圈子的title -->
          <van-col span="12" offset="3" class="group-name-label">
            <div>{{this.groupName}}</div>
          </van-col>

          <!-- 分享按钮 -->
          <van-col span="3">
            <van-button
              round
              size="large"
              :icon="require('../assets/share-white.png')"
              class="top-button"
            />
          </van-col>
          <!-- 会跳出关注圈主的弹窗 -->
          <van-col span="3">
            <van-button
              round
              size="large"
              :icon="require('../assets/more-white.png')"
              class="top-button"
              @click="moreClick()"
            />
          </van-col>
        </van-row>
      </van-sticky>

      <!-- 圈子相关的信息 -->
      <div class="group-info">
        <van-row>
          <van-col span="18">
            <div class="group-info-name">{{this.groupName}}</div>
          </van-col>
          <van-col span="6">
            <van-button v-show="!isjoined" class="user-follow-button" @click.stop="inClick()">加入</van-button>
            <van-button v-show="isjoined" class="user-followed-button" @click.stop="inClick()">已加入</van-button>
          </van-col>
        </van-row>
        <div class="group-info-description">{{this.groupDescription}}</div>
        <div class="group-info-num">作品 {{this.workNum}} · 成员 {{this.memberNum}}</div>
      </div>

      <!-- 圈主和成员相关的信息 -->
      <van-row class="member-master-row">
        <van-col span="3" offset="1">
          <van-image
            :src="masterImg"
            fit="cover"
            round
            @click="goUserDetail(masterId)"
            class="member-master-image"
          />
        </van-col>
        <van-col span="11">
          <div class="member-master-name">{{this.masterName}}</div>
          <div class="member-master-label">圈主</div>
        </van-col>
        <van-col span="8">
          <van-button
            size="large"
            class="member-members-button"
            @click="memberClick()"
          >{{this.moreString}}</van-button>
        </van-col>
      </van-row>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 圈子公告 -->
      <div class="announcement-row">
        <div class="announcement-title">圈子公告</div>
        <div class="announcement-block"></div>
      </div>

      <div class="announcement-content">{{this.groupAnnouncement}}</div>

      <!-- 详细信息栏 -->
      <div class="detail-info">
        <van-tabs v-model="active" sticky swipeable offset-top="100px" @scroll="scrollFixed">
          <van-tab title="全部">
            <invitation-detail-list :url="url" :userId="userId" :para="groupId" :type="2" />
          </van-tab>
          <van-tab title="热门">
            <invitation-detail-list :url="url" :userId="userId" :para="groupId" :type="5" />
          </van-tab>
        </van-tabs>
      </div>

      <!-- 关注举报弹出框 -->
      <van-popup v-model="moreShow" position="bottom" class="more-popup">
        <van-button
          v-show="!followMaster"
          class="more-popup-follow-button"
          @click="followClick()"
        >关注圈主</van-button>
        <van-button
          v-show="followMaster"
          class="more-popup-follow-button"
          @click="followClick()"
        >取消关注圈主</van-button>
      </van-popup>
    </van-skeleton>
  </div>
</template>

<script>
import { Toast } from "vant";
import InvitationDetailList from "../views/InvitationDetailList.vue";
import { get, post } from "../router/request.js";
export default {
  name: "GroupDetail",
  components: {
    InvitationDetailList
  },
  data() {
    return {
      userId: 1000, // 当前用户id 传进来
      groupImg: "",
      moreShow: false, //控制关注圈主
      groupId: 2, // 圈子id 传进来
      groupName: "然然的老婆圈",
      groupDescription:
        "作为然然爸爸的老婆，我们当然一定是特别喜欢然然爸爸和她的偶像tjh。",
      masterId: 140001,
      masterName: "然然爸爸坠可爱辣",
      masterImg: "https://img.yzcdn.cn/vant/cat.jpeg",
      moreString: "查看圈子成员 >",
      groupAnnouncement:
        "重要公告：今日圈内@然然爸爸发表的关于jwc和sxlx的一写想法入选了学习鸭官方热门，可喜可贺！重要的事情说三遍：今日圈内@然然爸爸发表的关于jwc和sxlx的一写想法入选了学习鸭官方热门，可喜可贺！今日圈内@然然爸爸发表的关于jwc和sxlx的一写想法入选了学习鸭官方热门，可喜可贺！今日圈内@然然爸爸发表的关于jwc和sxlx的一写想法入选了学习鸭官方热门，可喜可贺！",
      followMaster: false,
      workNum: 1200,
      memberNum: 1726,
      active: 0,
      topShow: true,
      url: "getWorkList", //对接：后端爸爸这里写死
      isjoined: false,
      loading: true
    };
  },
  methods: {
    goBackClick() {
      this.$router.go(-1);
    },
    moreClick() {
      //弹出举报/关注弹窗
      this.moreShow = true;
    },
    followClick() {
      //关注按钮响应
      get({
        url: "/api/follow",
        params: {
          userid: this.userId,
          careid: this.masterId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            if (res.data.status == 1) {
              Toast("关注成功");
              this.followMaster = true;
            } else {
              Toast("取消关注");
              this.followMaster = false;
            }
          } else {
            Toast(res.data.msg);
          }
          this.moreShow = false;
        })
        .catch(res => {
          Toast("加载失败");
          this.moreShow = false;
        });
    },
    inClick() {
      //加入圈子
      if (this.isjoined == false) {
        get({
          url: "/api/joinGroup",
          params: {
            userid: this.userId,
            groupid: this.groupId
          }
        })
          .then(res => {
            if (res.data.ok == 1) {
              Toast("加入成功");
              this.memberNum++;
              this.isjoined = true;
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(res => {
            Toast("加载失败");
          });
      } else {
        // 退出圈子
        get({
          url: "/api/exitGroup",
          params: {
            userid: this.userId,
            groupid: this.groupId
          }
        })
          .then(res => {
            if (res.data.ok == 1) {
              Toast("退出成功");
              this.isjoined = false;
              this.memberNum--;
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(res => {
            Toast("加载失败");
          });
      }
    },
    goUserDetail(val) {
      //跳转到用户详情页
      this.$router.push("/user/" + this.userId + "/" + val);
      console.log("跳到用户 " + val + " 的详情页");
    },
    memberClick() {
      //跳转到该圈子的所有用户页面
      this.$router.push("/groupmember/" + this.groupId);
      console.log("跳到圈子 " + this.groupId + " 的用户界面");
    },
    scrollFixed(val) {
      if (val.isFixed) {
        this.topShow = false;
      } else {
        this.topShow = true;
      }
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
    this.groupId = this.$route.params.groupId;

    get({
      url: "/api/getGroupMessage",
      params: {
        userid: this.userId,
        groupid: this.groupId
      }
    })
      .then(res => {
        console.log(res.data);
        if (res.data.ok == 1) {
          this.isLoading = false;
          this.groupName = res.data.groupname;
          this.groupImg = res.data.backgroundimage;
          this.masterId = res.data.creatorid;
          this.masterName = res.data.creatorname;
          this.masterImg = res.data.creatorHeadImg;
          this.workNum = res.data.groupworknum;
          this.memberNum = res.data.membernum;
          this.followMaster = res.data.creatorFollow;
          this.isjoined = res.data.ismember;
          this.groupDescription = res.data.description;
          this.groupAnnouncement = res.data.announcement;
          this.loading = false;
        }
      })
      .catch(res => {
        Toast("加载失败");
      });
  }
};
</script>

<style scoped>
.group-background-img {
  position: absolute;
  width: 375px;
  height: 350px;
  z-index: -1;
}

.group-background-img-fixed {
  position: absolute;
  width: 375px;
  height: 100px;
  z-index: -1;
  background-color: black;
  filter: blur(20px);
  -webkit-filter: blur(20px); /* chrome, opera */
  -ms-filter: blur(20px);
  -moz-filter: blur(20px);
}

.top-fixed-background {
  width: 375px;
  height: 100px;
  position: absolute;
  z-index: -2;
  background-color: white;
}

.van-icon__image {
  width: 25px;
  height: 25px;
}

.top {
  height: 100px;
  padding: 0px;
}

.top-tochose {
  padding-top: 50px;
  height: 50px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.25));
}

.top-tochose-fixed {
  padding-top: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0);
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.25));
}

.back-button {
  border: 0px;
  height: 50px;
  padding-left: 0px;
  background-color: rgba(0, 0, 0, 0);
}

.top-button {
  border: 0px;
  height: 50px;
  padding-left: 0px;
  background-color: rgba(0, 0, 0, 0);
}

.more-popup {
  width: 375px;
}

.more-popup-follow-button {
  width: 375px;
  font-size: 20px;
  color: #459cfc;
  border: 0px;
}

.group-name-label {
  font-size: 16px;
  color: white;
  line-height: 50px;
  text-align: center;
}

.group-info {
  width: 335px;
  padding-left: 20px;
  padding-right: 20px;
  height: 235px;
}

.group-info-name {
  font-size: 20px;
  font-weight: 500;
  color: white;
  height: 40px;
  line-height: 40px;
  padding-top: 25px;
}

.group-info-description {
  font-size: 12px;
  color: white;
  padding-top: 15px;
  height: 105px;
}

.group-info-num {
  font-size: 12px;
  color: white;
  padding-top: 15px;
}

.detail-info {
  background-color: rgba(0, 0, 0, 0);
}

.member-master-row {
  padding-top: 13px;
  padding-bottom: 5px;
  top: -25px;
  line-height: 40px;
  background-color: white;
  border-radius: 20px 20px 0px 0px;
}

.member-master-image {
  width: 40px;
  height: 40px;
}

.member-master-name {
  height: 20px;
  font-size: 13px;
  line-height: 20px;
  padding-bottom: 3px;
}

.member-master-label {
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    rgba(255, 216, 0, 0.8),
    rgba(255, 216, 0, 0.45)
  );
  width: 40px;
  text-align: center;
}

.member-members-button {
  border: 0px;
  background-color: rgba(0, 0, 0, 0);
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  height: 18px;
  line-height: 18px;
}

.divider {
  width: 375px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
}

.announcement-row {
  width: 345px;
  height: 18px;
  padding-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
  background-color: white;
}

.announcement-title {
  font-size: 16px;
  width: 65px;
  height: 14px;
  padding-bottom: -10px;
}

.announcement-block {
  background-color: #ffc800;
  width: 65px;
  height: 6px;
  border-radius: 3px;
}

.announcement-content {
  width: 345px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 12px;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: white;
}

.detail-info {
  width: 375px;
}

.block {
  background-color: #ffc800;
  height: 1000px;
  padding-left: 15px;
  padding-right: 15px;
  width: 345px;
  z-index: -2;
}

.user-follow-button {
  font-size: 14px;
  border: 0px;
  background-color: #ffc800;
  height: 26px;
  width: 80px;
  bottom: 10px;
  border-radius: 5px;
  height: 40px;
  line-height: 40px;
  margin-top: 32.5px;
}

.user-followed-button {
  font-size: 14px;
  border: 0px;
  background-color: rgba(0, 0, 0, 0.25);
  color: white;
  height: 26px;
  width: 80px;
  bottom: 10px;
  border-radius: 5px;
  height: 40px;
  line-height: 40px;
  margin-top: 32.5px;
}

.skeleton {
  padding-top: 200px;
}
</style>