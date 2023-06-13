<template>
  <div id="group-detail">
    <van-skeleton title :row="16" avatar class="skeleton" :loading="loading">
      <!-- 用户界面背景图 -->
      <van-image
        :src="require('../assets/background/userBackground.jpeg')"
        fit="fill"
        id="backImage"
      ></van-image>

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
          <!-- 用户名放在标题栏上 -->
          <van-col span="12" offset="3" class="group-name-label">
            <div>{{this.userName}}的用户详情</div>
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
          <!-- 会跳出学习效率统计的弹窗 -->
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
        <van-image
          :src="require('../assets/background/userBackground.jpeg')"
          fit="cover"
          id="backImageBar"
        ></van-image>
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
          <!-- 用户名放在标题栏上 -->
          <van-col span="12" offset="3" class="group-name-label">
            <div>{{this.userName}}的用户详情</div>
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
          <!-- 会跳出学习效率统计的弹窗 -->
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

      <!--用户头像和关注按钮-->
      <van-row id="infoBar">
        <van-col span="8">
          <div id="headImage">
            <van-image round width="80px" height="80px" :src="headImage" />
          </div>
        </van-col>
        <van-col span="6" offset="10">
          <van-button
            :icon="followIcon"
            @click="onFollowButton"
            type="primary"
            id="followButton"
          >{{followWord}}</van-button>
        </van-col>
      </van-row>

      <!--用户属性-->
      <van-tag color="#ffc800" id="moneyBar">鸭蛋数量 {{eggNumber}}</van-tag>

      <!--关注、粉丝、圈子-->
      <van-row id="numberBar">
        <van-col span="6">
          <van-button type="default" class="numberButton">关注: {{followNumber}}</van-button>
        </van-col>
        <van-col span="6">
          <van-button type="default" class="numberButton">粉丝: {{fanNumber}}</van-button>
        </van-col>
        <van-col span="12">
          <van-button type="default" class="numberButton">圈子: {{groupNumber}}</van-button>
        </van-col>
      </van-row>

      <div class="detail-info">
        <van-tabs
          v-model="active"
          sticky
          swipeable
          offset-top="100px"
          line-width="0px"
          @scroll="scrollFixed"
        >
          <van-tab title="用户作品" title-style="font-size:16px;" id="userWorkBlock">
            <UserPostList :myId="this.userId"/>
          </van-tab>
        </van-tabs>
      </div>

      <!--跳转倒学习界面的弹窗-->
      <van-popup v-model="moreShow" position="bottom" class="more-popup">
        <van-button class="more-popup-follow-button" @click="goStudyDetail">查看用户学习详情</van-button>
      </van-popup>
    </van-skeleton>
  </div>
</template>

<script>
import UserPostList from "./UserPostList";
import { get, post } from "../router/request.js";
import { Toast } from "vant";

export default {
  name: "UserInformation",
  components: { UserPostList },
  data() {
    return {
      loading: true,
      moreShow: false, //控制关注圈主
      myId: 1, // 当前使用者的id
      userId: 1000, // 当前主页用户的id
      userName: "",
      followIcon: "star-o",
      follow: false,
      followWord: "关注",
      followNumber: 0,
      fanNumber: 4,
      groupNumber: 10,
      eggNumber: 666,
      active: 0,
      topShow: true,
      headImage: "",
      postList: [{ id: 1 }, { id: 2 }, { id: 3 }]
    };
  },
  methods: {
    //返回按钮的响应函数
    goBackClick() {
      this.$router.go(-1);
    },
    moreClick() {
      //弹出举报/关注弹窗
      this.moreShow = true;
    },
    //点击查看用户详情的跳转函数
    goStudyDetail() {
      this.$router.push("/learningdetail/" + this.userId);
      console.log("跳到详情页面");
    },
    //关注用户按钮的响应函数
    onFollowButton() {
      get({
        url: "/api/follow",
        params: {
          userid: this.myId,
          careid: this.userId
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 1) {
            if (res.data.status == 1) {
              Toast("关注成功");
              this.followWord = "取关";
              this.followIcon = "star";
              this.follow = true;
              this.fanNumber++;
            } else {
              Toast("取消关注");
              this.followWord = "关注";
              this.followIcon = "star-o";
              this.follow = false;
              this.fanNumber--;
            }
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
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
    // 获取用户信息
    this.myId = this.$cookies.get("userid");
    console.log(this.myId);
    this.userId = this.$route.params.userId;
    console.log(this.userId);
    get({
      url: "/api/getUserInfo",
      params: {
        userid: this.userId,
        myid: this.myId
      }
    })
      .then(res => {
        if (res.data.ok == 1) {
          console.log(res.data);
          this.userName = res.data.username;
          this.headImage = res.data.headImage;
          this.eggNumber = res.data.credit;
          this.fanNumber = res.data.fansNum;
          this.followNumber = res.data.careNum;
          this.groupNumber = res.data.groupNum;
          this.loading = false;
          if (res.data.isfollowed == true) {
            this.followWord = "取关";
            this.followIcon = "star";
            this.follow = true;
          } else {
            this.followWord = "关注";
            this.followIcon = "star-o";
            this.follow = false;
          }
        }
      })
      .catch(res => {
        Toast("加载失败");
      });
  }
};
</script>

<style scoped>
#backImage {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -100;
}

#backImageBar {
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

#headImage {
  width: 80px;
  height: 80px;
  background-color: white;
  padding: 3px;
  border-radius: 50px;
}

#infoBar {
  margin: 10px;
}

#followButton {
  background-color: rgba(250, 250, 250, 0.1);
  border-color: lightgrey;
  margin-top: 22%;
  width: 100%;
}

.numberButton {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 16px;
}

#moneyBar {
  margin: 10px;
  font-size: 14px;
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

.group-name-label {
  font-size: 16px;
  color: white;
  line-height: 50px;
  text-align: center;
}

.detail-info {
  width: 375px;
}

#userWorkBlock {
  background-color: rgba(255, 255, 255, 0.5);
}

.more-popup {
  width: 375px;
  background: transparent;
}

.more-popup-follow-button {
  width: 375px;
  font-size: 20px;
  color: #459cfc;
  border: 0px;
}

.top-fixed-background {
  width: 375px;
  height: 100px;
  position: absolute;
  z-index: -2;
  background-color: rgb(200, 200, 200);
}

.top-tochose-fixed {
  padding-top: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0);
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.25));
}

.skeleton {
  padding-top: 200px;
}
</style>