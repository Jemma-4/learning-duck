<template>
  <div class="outerPost">
    <van-image fit="cover" :src="image" />
    <div class="invitation-info">
      <van-row justify="end">
        <van-col>
          <div id="postTitle">{{title}}</div>
        </van-col>
      </van-row>
      <div id="tagBar">
        <div v-for="(item,i) in tagList" :key="i" id="tag">#{{item}}</div>
      </div>
      <van-row class="communication-info-row" >
        <van-col span="8" offset="7">
          <van-button size="large" class="communication-like-button">{{this.likeNumber}}喜欢</van-button>
        </van-col>
        <van-col span="8" offset="1">
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
  name: "UserPost",
  props: {
    detail: {},
    // userId: 0
  },
  data() {
    return {
      userId: 0,
      title: "计网逢考必做资料大全",
      image: "https://img.yzcdn.cn/vant/cat.jpeg",
      invitationId: 0,
      likeNumber: 20,
      like: false,
      rewardNum: 1000,
      tagList: ['tag1', 'tag2', 'tag3', 'tag4'],
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
  font-size: 14px;
  width: 152.5px;
}

.outerPost {
  background-color: white;
  border-radius: 10px;
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

#tagBar
{
  display: flex;
}

#tag{
  font-size: 12px;
  color: #39a9ed;
  width: min-content;
  margin-right: 1px;
}

.communication-like-button
{
  border: 0px;
  right: 7px;
  height: 20px;
  font-size: 10px;
  bottom: 6px;
  border-radius: 12px;
  color: rgb(80, 172, 209);
  background-image: linear-gradient(
          to right,
          rgba(173,216,230, 0.45),
          rgba(173,216,230, 0.85)
  );
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