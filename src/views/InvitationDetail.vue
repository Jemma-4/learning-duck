<template>
  <div id="invitation-detail">
    <!-- 用户信息栏，头像，名称，日期，关注按钮 -->
    <van-row class="user-info-row" type="flex" justify="start" align="center">
      <van-col span="3">
        <van-image
          :src="userImg"
          fit="cover"
          round
          @click.stop="goUserDetail(userId)"
          class="user-info-img"
        ></van-image>
      </van-col>
      <van-col span="17">
        <van-row>
          <div class="user-info-name">{{this.name}}</div>
        </van-row>
        <van-row>
          <div class="user-info-date">{{this.date}}</div>
        </van-row>
      </van-col>
      <van-col span="5">
        <van-button v-show="!isFollow" class="user-follow-button" @click.stop="followClick()">关注</van-button>
        <van-button v-show="isFollow" class="user-followed-button" @click.stop="followClick()">已关注</van-button>
      </van-col>
    </van-row>

    <!-- 用户上传图片轮播图 -->
    <div>
      <van-swipe class="invitation-swipe">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img :src="image" fit="fill" class="swipe-img" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 帖子的标题 -->
    <div class="invitation-title">{{this.title}}</div>

    <!-- 帖子的大概内容 -->
    <div class="invitation-content">{{this.content}}</div>

    <!-- 交互栏，点赞，评论，转发，打赏，举报等 -->
    <van-row class="communication-row" type="flex" justify="start" align="center">
      <!-- 常量按钮，理应连接安卓原生 -->
      <van-col span="3">
        <van-button
          size="large"
          class="communication-icon-button"
          :icon="isLike==true?require('../assets/like-active.png'):require('../assets/like.png')"
          @click.stop="likeClick()"
        ></van-button>
      </van-col>
      <van-col span="3">
        <van-button
          size="large"
          class="communication-icon-button"
          :icon="require('../assets/comment.png')"
          @click.stop="commentClick()"
        ></van-button>
      </van-col>
      <van-col span="3">
        <van-button
          size="large"
          class="communication-icon-button"
          :icon="require('../assets/share.png')"
          @click.stop="shareClick()"
        ></van-button>
      </van-col>
      <van-col span="3">
        <van-button
          size="large"
          class="communication-icon-button"
          :icon="require('../assets/more.png')"
          @click.stop="moreClick()"
        ></van-button>
      </van-col>
      <van-col span="5" offset="6">
        <van-button
          size="large"
          class="communication-reward-button"
          @click.stop="rewardClick()"
        >{{this.rewardNum}} 小鸭蛋</van-button>
      </van-col>
    </van-row>

    <!-- 贴子热度信息 -->
    <div
      class="communication-num"
    >点赞 {{this.likeNum}} · 评论 {{this.commentNum}} · 转发 {{this.shareNum}}</div>

    <!-- 话题列表，点击进入话题详情 -->
    <div class="tag-list">
      <van-button
        v-for="item in tagList"
        :key="item.id"
        @click.stop="goTagDetail(item.tagId)"
        class="tag-button"
      >#{{item.tag}}</van-button>
    </div>

    <!-- 评论列表，点击了解用户，回复评论 -->
    <div class="comment-list">
      <div v-for="item in commentList" :key="item.id" class="comment-item">
        <!-- 评论帖子的样式 -->
        <div v-show="item.type=='0'">
          <button class="comment-user-name" @click.stop="goUserDetail(item.userId)">{{item.userName}}</button>
          <button
            class="comment-user-content"
            @click.stop="replyCommentClick(item.userId,item.commentId,item.userName)"
          >{{item.content}}</button>
        </div>
        <!-- 评论评论的样式 -->
        <van-row>
          <div v-show="item.type=='1'">
            <van-col>
              <button class="comment-user-name" @click="goUserDetail(item.userId)">{{item.userName}}</button>
            </van-col>
            <van-col>
              <div class="reply-describe">回复</div>
            </van-col>
            <van-col>
              <button
                class="comment-user-name"
                @click.stop="goUserDetail(item.parentUserId)"
              >{{item.parentUserName}}</button>
              <button
                class="comment-user-content"
                @click.stop="replyCommentClick(item.userId,item.commentId,item.userName)"
              >{{item.content}}</button>
            </van-col>
          </div>
        </van-row>
      </div>
    </div>

    <!-- 查看更多评论，跳转到详情页面 -->
    <div class="get-more-row">
      <van-button class="get-more-button" @click.stop="goInvitation(workId)">查看更多评论</van-button>
    </div>

    <div style="height:15px;" />

    <!-- 评论弹出框 -->
    <van-popup v-model="commentShow" duration="0.3" round :overlay="false" class="comment-popup">
      <div class="comment-input">
        <div class="comment-title-label">评论</div>
        <textarea v-model="myComment" placeholder="请输入评论" class="comment-textarea" />
        <van-row type="flex" justify="center" align="center">
          <van-col span="12">
            <van-button class="comment-button" @click="commentConfirm()">确认</van-button>
          </van-col>
          <van-col span="12">
            <van-button class="comment-button" @click="commentCancel()">取消</van-button>
          </van-col>
        </van-row>
      </div>
    </van-popup>

    <!-- 关注举报弹出框 -->
    <van-popup v-model="moreShow" position="bottom" class="more-popup">
      <van-button v-show="!isFollow" class="more-popup-follow-button" @click="followClick()">关注</van-button>
      <van-button v-show="isFollow" class="more-popup-follow-button" @click="followClick()">取消关注</van-button>
      <van-button class="more-popup-report-button" @click="reportClick()">举报</van-button>
    </van-popup>

    <!-- 回复评论弹出框 -->
    <van-popup v-model="replyShow" duration="0.3" round :overlay="false" class="comment-popup">
      <div class="comment-input">
        <div class="comment-title-label">回复 {{this.replyUserName}} 评论</div>
        <textarea v-model="replyComment" placeholder="请输入回复" class="comment-textarea" />
        <van-row type="flex" justify="center" align="center">
          <van-col span="12">
            <van-button class="comment-button" @click="replayCommentConfirm(replyCommentId)">确认</van-button>
          </van-col>
          <van-col span="12">
            <van-button class="comment-button" @click="replayCommentCancel()">取消</van-button>
          </van-col>
        </van-row>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import { get } from "../router/request.js";

export default {
  name: "InvitationDetail",
  props: {
    detail: {},
    // myId: 0, //用户id
    myName: ""
  },
  data() {
    return {
      myId: 0, //用户id
      name: "妮妮鸭", //用户名字
      userImg: "https://img.yzcdn.cn/vant/cat.jpeg", //用户头像url
      userId: 0,
      date: "7月7日 21:07", //发帖日期
      images: [],
      workId: 122230, //帖子ID
      title: "这是个标题呀，可长可短欸", //帖子梗概，希望不要太长
      content:
        "这是个内容呀，可长可短欸，最多大概50个字。这是个内容呀，可长可短欸，最多大概50个字。这是个内容呀，可长可短欸，最多大概50个字。这是个内容呀，可长可短欸，最多大概50个字。", //帖子前50个字
      isFollow: false, //我 是否关注该用户
      isLike: true, //我 是否点赞
      commentShow: false, //控制评论弹窗
      moreShow: false, //控制举报/关注弹窗
      replyShow: false, //控制回复评论窗口
      replyComment: "", //用户回复的评论
      myComment: "", //用户评论
      likeNum: 61, //帖子点赞数
      commentNum: 20, //帖子评论数
      shareNum: 3, //帖子分享数
      rewardNum: 1000, //帖子鸭蛋数
      isIllegal: false, //我 是否举报该帖子
      tagList: [], //相关话题列表
      commentList: [], //相关评论列表
      replyCommentId: 0,
      replyUserName: "",
      replyUserId: 0
    };
  },
  methods: {
    followClick() {
      get({
        url: "/api/follow",
        params: {
          userid: this.myId,
          careid: this.userId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            if (res.data.status == 1) {
              Toast("关注成功");
              this.isFollow = true;
            } else {
              Toast("取消关注");
              this.isFollow = false;
            }
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
    },
    likeClick() {
      get({
        url: "/api/thumbUp",
        params: {
          userid: this.myId,
          workid: this.workId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            if (res.data.status == 1) {
              this.isLike = true;
              Toast("点赞成功");
            } else {
              this.isLike = false;
              Toast("点赞失败");
            }
            this.likeNum = res.data.attitudenum;
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
    },
    commentClick() {
      //评论按钮，弹窗
      this.commentShow = true;
    },
    commentConfirm() {
      //评论弹窗，数据交互
      if (this.myComment == "") {
        Toast("评论内容不能为空");
        return;
      }
      get({
        url: "/api/addComment",
        params: {
          userid: this.myId,
          commentparentid: "@" + String(this.workId),
          content: this.myComment,
          rootknot: this.workId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.commentList.push({
              commentId: res.data.commentId,
              content: this.myComment,
              id: res.data.id,
              type: 0,
              userId: this.myId,
              userName: this.myName
            });
            this.myComment = "";
            Toast("评论成功");
          }
        })
        .catch(res => {
          Toast("加载失败");
        });

      this.commentShow = false;
    },
    commentCancel() {
      //取消
      this.commentShow = false;
      this.myComment = "";
    },
    shareClick() {
      //弹出分享框，未定
    },
    moreClick() {
      //弹出举报/关注弹窗
      this.moreShow = true;
    },
    reportClick() {
      this.moreShow = false;
      if (this.isIllegal == true) {
        Toast("请勿重复举报");
        return;
      }
      //举报记录送给后端
      get({
        url: "/api/report",
        params: {
          eventtype: 1,
          eventid: this.workId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            Toast("举报成功");
            this.isIllegal = true;
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
    },
    rewardClick() {
      //作品鸭蛋数量详情，未定
    },
    goTagDetail(val) {
      //跳转到话题详情页
      console.log("跳到话题 " + val + " 的详情页");
      this.$router.push("/tag/" + this.myId + "/" + val);
    },
    goUserDetail(val) {
      //跳转到用户详情页
      console.log("跳到用户 " + val + " 的详情页");
      this.$router.push("/user/" + this.myId + "/" + val);
    },
    goInvitation(val) {
      //跳转到帖子3级详情页
      this.$router.push("/invitation/" + this.myId + "/" + val);
    },
    replyCommentClick(userid, id, name) {
      //点击跳出评论评论弹窗
      (this.replyUserId = userid), (this.replyCommentId = id);
      this.replyUserName = name;
      this.replyShow = true;
    },
    replayCommentConfirm(val) {
      //数据交互，将回复详情发给后端
      if (this.replyComment == "") {
        Toast("回复内容不能为空");
        return;
      }
      get({
        url: "/api/addComment",
        params: {
          userid: this.myId,
          commentparentid: String(this.replyCommentId),
          content: this.replyComment,
          rootknot: this.workId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            console.log(res.data);
            this.commentList.push({
              commentId: res.data.commentId,
              content: this.replyComment,
              parentId: this.replyCommentId,
              parentUserId: this.replyUserId,
              parentUserName: this.replyUserName,
              type: 1,
              userId: this.myId,
              userName: this.myName
            });
            this.replyComment = "";
            Toast("评论成功");
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
      this.replyShow = false;
      console.log("回复 " + val + " 评论");
    },
    replayCommentCancel() {
      this.replyShow = false;
      this.replyComment = "";
    }
  },

  mounted() {
    this.myId = this.$cookies.get("userid");
    console.log(this.detail);
    this.name = this.detail.userName;
    this.userImg = this.detail.userImg;
    let date = new Date(this.detail.releasetime);
    this.date =
      this.detail.releasetime.split("T")[0] +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    this.images = this.detail.images;
    this.workId = this.detail.workid;
    this.title = this.detail.title;
    this.content = this.detail.postAbstractContent;
    this.isFollow = this.detail.isFollow;
    this.isLike = this.detail.isLike;
    this.likeNum = this.detail.likeNum;
    this.commentNum = this.detail.commentNum;
    this.shareNum = this.detail.shareNum;
    this.rewardNum = this.detail.rewardNum;
    this.tagList = this.detail.tagList;
    this.commentList = this.detail.commentList;
    this.userId = this.detail.userId;
  }
};
</script>

<style scoped>
#invitation-detail {
  width: 375px;
  background-color: white;
}

.user-info-row {
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: 40px;
}

.user-info-name {
  padding-left: 15px;
  height: 20px;
  font-size: 14px;
}

.user-info-date {
  padding-left: 15px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.user-info-img {
  height: 40px;
  width: 40px;
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

.invitation-swipe {
  height:300px;
  }

.swipe-img {
  height:300px;
}

.invitation-title {
  padding-left: 15px;
  padding-top: 15px;
  font-size: 15px;
  font-weight: 550;
  width: 345px;
}

.invitation-content {
  padding-left: 15px;
  padding-top: 10px;
  font-size: 14px;
  width: 345px;
}

.communication-icon-button {
  border: 0px;
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

.van-icon__image {
  width: 23px;
  height: 23px;
}

.comment-popup {
  background-color: rgba(245, 245, 245, 0.9);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
}

.comment-input {
  background-color: rgba(245, 245, 245, 0.9);
}

.comment-title-label {
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 20px;
  width: 270px;
  height: 20px;
  font-weight: 550;
  text-align: center;
}

.comment-textarea {
  width: 270px;
  border: 0px;
  font-size: 16px;
  overflow: hidden;
  height: 100px;
}

.comment-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  color: #459cfc;
  text-align: center;
  width: 135px;
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

.more-popup-report-button {
  width: 375px;
  font-size: 20px;
  color: rgba(255, 60, 60, 0.65);
  border: 0px;
}

.communication-num {
  width: 345px;
  padding-left: 15px;
  padding-right: 15px;
  height: 16px;
  font-size: 14px;
}

.tag-list {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 8px;
  line-height: 16px;
}

.tag-button {
  border: 0px;
  padding-left: 0px;
  padding-right: 8px;
  color: #459cfc;
  height: 14px;
}

.comment-list {
  padding-left: 15px;
  padding-top: 4px;
  line-height: 16px;
  padding-right: 15px;
}

.comment-user-name {
  font-size: 14px;
  border: 0px;
  background-color: white;
}

.comment-user-content {
  font-size: 14px;
  border: 0px;
  background-color: white;
  color: rgba(0, 0, 0, 0.45);
}

.get-more-row {
  width: 345px;
  padding-left: 15px;
  padding-right: 15px;
  line-height: 16px;
}

.get-more-button {
  border: 0px;
  padding: 0px;
  padding-top: 5px;
  height: 16px;
  color: rgba(0, 0, 0, 0.45);
}

.reply-describe {
  font-size: 14px;
  border: 0px;
  background-color: white;
  color: rgba(0, 0, 0, 0.45);
  padding: 0px;
  width: 30px;
  padding-top: 7px;
  height: 16px;
}
</style>