<template>
  <div id="invitation-detail">
    <van-skeleton title :row="16" avatar class="skeleton" :loading="loading">
      <!-- 用户信息栏，头像，名称，日期，关注按钮 -->
      <van-sticky>
        <van-row class="user-info-row" type="flex" justify="start" align="center">
          <van-col span="2">
            <van-button
              size="large"
              class="back-button"
              :icon="require('../assets/back.png')"
              @click="goBackClick()"
            ></van-button>
          </van-col>
          <van-col span="3">
            <van-image
              :src="userImg"
              fit="cover"
              round
              @click="goUserDetail(userId)"
              class="user-info-img"
            ></van-image>
          </van-col>
          <van-col span="17">
            <div class="user-info-name">{{this.name}}</div>
          </van-col>
          <van-col span="5">
            <van-button v-show="!isFollow" class="user-follow-button" @click="followClick()">关注</van-button>
            <van-button v-show="isFollow" class="user-followed-button" @click="followClick()">已关注</van-button>
          </van-col>
        </van-row>
      </van-sticky>

      <!-- 用户上传图片轮播图 -->
      <div>
        <van-swipe class="invitation-swipe">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img :src="image" fit="none" class="swipe-img" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 帖子的标题 -->
      <div class="invitation-title">{{this.title}}</div>

      <!-- 要付费帖子未付费状态 -->
      <div v-show="needPay&&!isPaied">
        <!-- 帖子的大概内容 -->
        <div class="invitation-content">{{this.content}}</div>
        <div class="pay-info">作者设置该帖子为付费内容,需支付鸭蛋来解锁</div>
        <van-row class="pay-row" type="flex" justify="start" align="center">
          <div>价值：</div>
          <div class="pay-num">{{this.needNum}}</div>
          <div>个小鸭蛋</div>
        </van-row>
        <van-button class="pay-button" @click="payClick()">解锁</van-button>
      </div>

      <!-- 非付费帖子和已付费贴子 -->
      <div v-show="!needPay||isPaied">
        <!-- 帖子的大概内容 -->
        <div class="invitation-content">{{this.detailContent}}</div>
      </div>

      <div class="user-info-date">{{this.date}}</div>

      <!-- 交互栏，点赞，评论，转发，打赏，举报等 -->
      <van-row class="communication-row" type="flex" justify="start" align="center">
        <!-- 常量按钮，理应连接安卓原生 -->
        <van-col span="3">
          <van-button
            size="large"
            class="communication-icon-button"
            :icon="isLike==true?require('../assets/like-active.png'):require('../assets/like.png')"
            @click="likeClick()"
          ></van-button>
        </van-col>
        <van-col span="3">
          <van-button
            size="large"
            class="communication-icon-button"
            :icon="require('../assets/comment.png')"
            @click="commentClick()"
          ></van-button>
        </van-col>
        <van-col span="3">
          <van-button
            size="large"
            class="communication-icon-button"
            :icon="require('../assets/share.png')"
            @click="shareClick()"
          ></van-button>
        </van-col>
        <van-col span="3">
          <van-button
            size="large"
            class="communication-icon-button"
            :icon="require('../assets/more.png')"
            @click="moreClick()"
          ></van-button>
        </van-col>
        <van-col span="5" offset="6">
          <van-button
            size="large"
            class="communication-reward-button"
            @click="rewardClick()"
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
          @click="goTagDetail(item.tagId)"
          class="tag-button"
        >#{{item.tag}}</van-button>
      </div>

      <!-- 评论列表，点击了解用户，回复评论 -->
      <div class="comment-list">
        <div
          v-for="item in commentList"
          :key="item.id"
          v-show="item.id<'5'||isMoreShow"
          class="comment-item"
        >
          <!-- 评论帖子的样式 -->
          <div v-show="item.type=='0'">
            <button class="comment-user-name" @click="goUserDetail(item.userId)">{{item.userName}}</button>
            <button
              class="comment-user-content"
              @click="replyCommentClick(item.commentId,item.userName)"
            >{{item.content}}</button>
          </div>
          <!-- 评论评论的样式 -->
          <van-row>
            <div v-show="item.type=='1'">
              <van-col>
                <button
                  class="comment-user-name"
                  @click="goUserDetail(item.userId)"
                >{{item.userName}}</button>
              </van-col>
              <van-col>
                <div class="reply-describe">回复</div>
              </van-col>
              <van-col>
                <button
                  class="comment-user-name"
                  @click="goUserDetail(item.parentUserId)"
                >{{item.parentUserName}}</button>
                <button
                  class="comment-user-content"
                  @click="replyCommentClick(item.commentId,item.userName)"
                >{{item.content}}</button>
              </van-col>
            </div>
          </van-row>
        </div>
      </div>

      <!-- 查看更多评论，跳转到详情页面 -->
      <div class="get-more-row">
        <van-button class="get-more-button" v-show="!isMoreShow" @click="showMoreComments()">查看更多评论</van-button>
      </div>

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
    </van-skeleton>
  </div>
</template>

<script>
import { Toast } from "vant";
import { get } from "../router/request.js";
export default {
  name: "Invitation",
  data() {
    return {
      myId: 1000, // 当前用户的ID（传进来）
      workId: 4, // 当前帖子ID（传进来）
      name: "妮妮鸭", //用户名字
      userId: 111112, //用户ID
      userImg: "https://img.yzcdn.cn/vant/cat.jpeg", //用户头像url
      date: "", //发帖日期
      images: [],
      id: 122230, //帖子ID
      title: "这是标题鸭", //帖子梗概，希望不要太长
      backString: "<",
      content: "这是内容鸭，这边是付费帖子展示的梗概", //帖子前100个字
      detailContent: "这是内容鸭，这边是非付费帖子和已付费的帖子内容",
      needPay: true, //帖子状态需不需要付费
      isPaied: false, //是否付费
      needNum: 10, //需要支付的鸭蛋数量
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
      isMoreShow: false, //是否展示更多
      tagList: [], //相关话题列表
      commentList: [], //相关评论列表
      replyCommentId: 0,
      replyUserName: "",
      loading:true
    };
  },
  methods: {
    goBackClick() {
      this.$router.go(-1);
    }, //返回按钮
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
            } else {
              this.isLike = false;
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
            Toast("评论成功");
            this.getWorkInfo(true); // 刷新评论区
          }
        })
        .catch(res => {
          Toast("加载失败");
        });

      this.commentShow = false;
      this.myComment = "";
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
      this.$router.push("/tag/" + this.userId + "/" + val);
    },
    goUserDetail(val) {
      //跳转到用户详情页
      console.log("跳到用户 " + val + " 的详情页");
      this.$router.push("/user/" + this.userId + "/" + val);
    },
    showMoreComments() {
      //跳转到帖子3级详情页
      this.isMoreShow = true;
      console.log("展示更多帖子");
    },
    replyCommentClick(id, name) {
      //点击跳出评论评论弹窗
      this.replyCommentId = id;
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
            Toast("评论成功");
            this.getWorkInfo(true); // 刷新评论区
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
      this.replyShow = false;
      this.replyComment = "";
      console.log("回复 " + val + " 评论");
    },
    replayCommentCancel() {
      this.replyShow = false;
      this.replyComment = "";
    },
    payClick() {
      //发信息给后端看能否支付
      get({
        url: "/api/purchaseWork",
        params: {
          userid: this.myId,
          workid: this.workId
        }
      })
        .then(res => {
          if (res.data.ok == 0) {
            Toast("余额不足，解锁失败");
            return;
          }
          this.detailContent = res.data.detailContent;
          this.isPaied = true;
          Toast("解锁成功");
        })
        .catch(res => {
          Toast("加载失败");
        });
    },
    // 为true时，只刷新评论区
    getWorkInfo(refreshFlag) {
      // 获取帖子详情
      get({
        url: "/api/getWorkInfo",
        params: {
          userid: this.myId,
          workid: this.workId
        }
      })
        .then(res => {
          if (res.data.ok == 0) {
            Toast("加载失败");
            return;
          }
          if (!refreshFlag) {
            console.log(res.data);
            this.loading=false
            this.userId = res.data.userId;
            this.name = res.data.userName;
            this.userImg = res.data.userImg;
            this.isFollow = res.data.isFollow;
            this.isPaied = res.data.isPaied;
            this.isLike = res.data.isLike;
            this.title = res.data.title;
            this.needNum = res.data.needNum;
            this.needPay = res.data.needPay;
            this.detailContent = res.data.detailContent;
            this.content = res.data.content;
            this.likeNum = res.data.likeNum;
            this.shareNum = res.data.shareNum;
            this.tagList = res.data.tagList;
            this.images = res.data.images;
            this.rewardNum = res.data.rewardNum;
            let date = new Date(res.data.releasetime);
            this.date =
              res.data.releasetime.split("T")[0] +
              " " +
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds();
          }
          this.commentNum = res.data.commentNum;
          this.commentList = res.data.commentList;
        })
        .catch(res => {
          Toast("加载失败");
        });
    }
  },
  mounted() {
    this.myId = this.$cookies.get("userid");
    this.workId = this.$route.params.workId;
    this.getWorkInfo(false);
  }
};
</script>

<style scoped>
#invitation-detail {
  width: 375px;
  height: 100px;
}

.back-button {
  border: 0px;
  padding-left: 0px;
  padding-bottom: 10px;
}

.user-info-row {
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: 40px;
  background-color: white;
}

.user-info-name {
  padding-left: 15px;
  height: 20px;
  font-size: 14px;
}

.user-info-date {
  padding-left: 15px;
  padding-top: 10px;
  height: 15px;
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
  width: 375px;
}

.swipe-img {
  width: 375px;
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
}

.comment-user-name {
  font-size: 14px;
  border: 0px;
  height: 16px;
  background-color: white;
}

.comment-user-content {
  font-size: 14px;
  border: 0px;
  background-color: white;
  color: rgba(0, 0, 0, 0.45);
  height: 16px;
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

.get-more-row {
  width: 360px;
  padding-left: 15px;
  line-height: 16px;
}

.get-more-button {
  border: 0px;
  padding: 0px;
  padding-top: 5px;
  height: 16px;
  color: rgba(0, 0, 0, 0.45);
}

.pay-info {
  font-size: 14px;
  padding-left: 15px;
  padding-right: 15px;
  color: #ffc800;
}

.pay-row {
  font-size: 14px;
  padding-left: 15px;
  padding-right: 15px;
  color: #ffc800;
}

.pay-num {
  font-size: 20px;
  color: black;
  padding-right: 5px;
}

.pay-button {
  width: 75px;
  left: 150px;
  border: 0px;
  height: 30px;
  font-size: 14px;
  border-radius: 12px;
  color: #ffc800;
  background-image: linear-gradient(
    to right,
    rgba(247, 245, 146, 0.45),
    rgba(247, 245, 146, 0.85)
  );
}

.skeleton{
  padding-top:200px;
}
</style>