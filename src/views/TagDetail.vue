<template>
  <div id="tag-detail">
    <!-- 顶部标签未吸顶+固定在顶部 返回 分享 退出圈子 -->
    <van-sticky :offset-top="0" class="top" v-show="topShow">
      <van-row class="top-tochose" type="flex" justify="start" align="bottom">
        <!-- 返回按钮 -->
        <van-col span="3">
          <van-button
            size="large"
            class="back-button"
            :icon="require('../assets/back.png')"
            @click="goBackClick()"
          ></van-button>
        </van-col>

        <!-- 话题的title -->
        <van-col span="18" class="tag-name-label">
          <div></div>
        </van-col>

        <!-- 分享按钮 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/share-black.png')"
            class="top-button"
          />
        </van-col>
      </van-row>
    </van-sticky>

    <!-- 顶部标签吸顶+固定在顶部 返回 分享 退出圈子 -->
    <van-sticky :offset-top="0" class="top" v-show="!topShow">
      <div class="top-fixed-background" />
      <van-row class="top-tochose-fixed" type="flex" justify="start" align="bottom">
        <!-- 返回按钮 -->
        <van-col span="3">
          <van-button
            size="large"
            class="back-button"
            :icon="require('../assets/back.png')"
            @click="goBackClick()"
          ></van-button>
        </van-col>

        <!-- 圈子的title -->
        <van-col span="18" class="tag-name-label">
          <div># {{this.tagName}}</div>
        </van-col>

        <!-- 分享按钮 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/share-black.png')"
            class="top-button"
          />
        </van-col>
      </van-row>
    </van-sticky>

    <div class="tag-title"># {{this.tagName}}</div>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 详细信息栏 -->
    <div class="detail-info">
      <van-tabs v-model="active" sticky swipeable offset-top="100px" @scroll="scrollFixed">
        <van-tab title="全部">
          <invitation-list :url="url" :userId="userId" :para="tagId" :type="3" />
        </van-tab>
        <van-tab title="热门">
          <invitation-list :url="url" :userId="userId" :para="tagId" :type="6" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import InvitationList from "../views/InvitationList.vue";
import { get, post } from "../router/request.js";
export default {
  name: "TagDetail",
  components: {
    InvitationList,
  },
  data() {
    return {
      userId: 1000,
      moreShow: false, //控制关注圈主
      tagId: 4, // 传进来
      tagName: "",
      active: 0,
      topShow: true,
      url: "getWorkList",
      workNum: 0,   // 帖子数量
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
    scrollFixed(val) {
      if (val.isFixed) {
        this.topShow = false;
      } else {
        this.topShow = true;
      }
    },
  },
  mounted() {
    // 获取标签详情
    this.userId = this.$cookies.get("userid");
    this.tagId=this.$route.params.tagId
    get({
      url: "/api/getTagInfo",
      params: {
        tagid: this.tagId,
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.ok == 1) {
          this.tagName = res.data.tagname;
          this.workNum = res.data.worknums;
        }else{
          Toast(res.data.msg);
        }
      })
      .catch((res) => {
        Toast("获取Tag详情失败");
      });
  },
};
</script>

<style scoped>
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
  background-color: white;
}

.top-tochose-fixed {
  padding-top: 50px;
  height: 50px;
  background-color: white;
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

.tag-name-label {
  font-size: 16px;
  color: black;
  line-height: 50px;
  text-align: center;
}

.divider {
  width: 375px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
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

.tag-title {
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 30px;
}
</style>