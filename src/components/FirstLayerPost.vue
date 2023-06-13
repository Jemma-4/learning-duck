<template>
  <div class="outerPost">
    <van-image fit="cover" :src="image" />
    <div class="invitation-info">
      <van-row class="user-info-row">
        <van-col span="6">
          <van-image round fit="cover" class="head-image" :src="userImage" />
        </van-col>
        <van-col span="8" id="userName">{{userName}}</van-col>
      </van-row>
      <van-row justify="end">
        <van-col>
          <div id="postTitle">{{title}}</div>
        </van-col>
      </van-row>
      <van-row class="communication-info-row" justify="start">
        <van-col span="4">
          <van-button
            size="large"
            id="likeIcon"
            :icon="like==true?require('../assets/like-active.png'):require('../assets/like.png')"
            @click.stop="clickLike()"
          ></van-button>
        </van-col>
        <van-col span="6" offset="1" id="likeNumber">{{likeNumber}}</van-col>
        <van-col span="8" offset="5">
          <van-button size="large" class="communication-reward-button">{{this.rewardNum}}鸭蛋</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { get, post } from "../router/request.js";

export default {
  name: "FirstLayerPost",
  props: {
    detail: {},
    userId: 0
  },
  data() {
    return {
      title: "计网逢考必做资料大全",
      image: "",
      invitationId: 0,
      likeNumber: 20,
      userName: "发帖人",
      userImage: "",
      like: false,
      rewardNum: 1000
    };
  },
  methods: {
    clickLike() {
      get({
        url: "/api/thumbUp",
        params: {
          userid: this.userId,
          workid: this.invitationId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            if (res.data.status == 1) {
              this.like = true;
              Toast("点赞成功");
            } else {
              this.like = false;
              Toast("取消点赞");
            }
            this.likeNum = res.data.attitudenum;
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
    if (this.detail) {
      (this.title = this.detail.title),
        (this.invitationId = this.detail.workid),
        (this.likeNumber = this.detail.likeNum),
        (this.userName = this.detail.userName),
        (this.like = this.detail.isLike),
        (this.rewardNum = this.detail.rewardNum),
        (this.image = this.detail.images[0]),
        (this.userImage = this.detail.userImg);
    } else {
      Toast("加载失败");
    }
  }
};
</script>

<style scoped>
.van-image >>> .van-image__img {
  border-radius: 6px 6px 0px 0px;
  margin: 0px;
  top: 0px;
}

#postTitle {
  font-size: 12px;
  width: 152.5px;
}

.outerPost {
  background-color: white;
  border-radius: 10px;
}

.user-info-row {
  height: 40px;
}

.head-image {
  width: 25px;
  height: 25px;
}

#userName {
  font-size: 12px;
  width:100px;
  line-height: 40px;
  height: 40px;
  font-weight: 550;
}

#likeNumber {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.35);
  text-align: left;
  height: 40px;
  line-height: 40px;
  padding-top: 3px;
}

#likeIcon {
  background-color: rgba(0, 0, 0, 0);
  height: 40px;
  line-height: 40px;
  border: 0px;
  z-index: 1;
}

.invitation-info {
  background-color: white;
  border-radius: 0px 0px 6px 6px;
  padding-left: 10px;
  padding-right: 10px;
}
.communication-info-row {
  height: 40px;
  line-height: 40px;
}

.communication-reward-button {
  border: 0px;
  right: 7px;
  height: 20px;
  font-size: 10px;
  bottom: 6px;
  border-radius: 12px;
  color: #ffc800;
  background-image: linear-gradient(
    to right,
    rgba(247, 245, 146, 0.45),
    rgba(247, 245, 146, 0.85)
  );
}
</style>