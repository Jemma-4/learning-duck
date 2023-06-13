<template>
  <div id="message">
    <van-row class="title">
      <van-col span="3">
        <van-button
          size="large"
          class="back-button"
          :icon="require('../assets/back.png')"
          @click="goBackClick()"
        ></van-button>
      </van-col>
      <van-col span="18">
        <div
          style="font-size:16px;padding-top:15px;padding-bottom:5px;color:black;text-align:center"
        >我的消息</div>
      </van-col>
      <van-col span="3"></van-col>
    </van-row>
    <div class="divider"></div>
    <div class="message-list">
      <div v-for="item in msgList" :key="item.id" class="message-item">
        <!-- 消息互动 -->

        <van-row class="user-info-row" type="flex" justify="start" align="center">
          <van-col span="3">
            <!-- 头像 -->
            <van-image
              :src="item.userImg"
              fit="cover"
              square
              @click="goUserDetail(item.userId)"
              class="user-info-img"
            ></van-image>
          </van-col>

          <van-col span>
            <van-row>
              <div class="user-info-name">{{item.userName}}</div>
            </van-row>

            <van-row>
              <div class="user-info-time">{{item.msgtime}}</div>
            </van-row>
          </van-col>
        </van-row>

        <van-row class="msg-type-row" type="flex" justify="start" align="center">
          <div v-show="item.msgtype=='0'">关注了您</div>
          <div
            v-show="item.msgtype=='1'"
            @click="goWorkDetail(item.workid)"
          >点赞了您的作品:《{{item.worktitle}}》</div>
          <div
            v-show="item.msgtype=='2'"
            @click="goWorkDetail(item.workid)"
          >评论了您的作品:《{{item.worktitle}}》</div>
          <div v-show="item.msgtype=='3'">回复了您:@"{{item.mycomment}}"</div>
        </van-row>

        <van-row class="msg-detail-row" type="flex" justify="start" align="center">
          <div v-show="item.msgtype=='2'||item.msgtype=='3'">
            <van-col>
              <button
                hairline
                type="primary"
                plain
                class="van-ellipsis"
                @click="replyCommentClick(item.commentId,item.userName)"
              >{{item.comment}}</button>
            </van-col>
            <van-col>
            </van-col>
          </div>
        </van-row>
        <div class="divider"></div>
      </div>
    </div>
    <div class="divider"></div>
    <div
      style="font-size:16px;padding-top:10px;padding-bottom:10px;color:rgba(0, 0, 0, 0.45);text-align:center"
    >没有更多内容了</div>

  
  </div>
</template>

<script>
import { get } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "message",
  data() {
    return {
      userid: 0,
      replyShow: false, //控制回复评论窗口
      replyComment: "", //用户回复的评论
      userName: "",
      replyCommentId: 0,
      msgList: [
        //相关评论列表，点击用户名可跳转用户详情页
        {
          id: 1,
          userId: 112221,
          userName: "刘佬",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          msgtime: "2020-7-21 12:30:58",
          msgtype: 0
        },
        {
          id: 2,
          userId: 112222,
          userName: "张佬",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          msgtime: "2020-7-21 12:30:58",
          msgtype: 1,
          workid: 111,
          worktitle: "写完了信号作业"
        },
        {
          id: 3,
          userId: 112223,
          userName: "刘佬",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          msgtime: "2020-7-21 12:30:58",
          msgtype: 2,
          workid: 222,
          worktitle: "写完了信号作业",
          commentid: 1,
          comment: "写得不错！"
        },
        {
          id: 4,
          userId: 112224,
          userName: "刘佬",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          msgtime: "2020-7-21 12:30:58",
          msgtype: 3,
          mycomment: "信号作业借我抄一下",
          commentid: 2,
          comment: "你在想桃子！"
        },
        {
          id: 5,
          userId: 112225,
          userName: "张佬",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          msgtime: "2020-7-20 12:30:58",
          msgtype: 0
        }
      ] //相关评论列表
    };
  },
  methods: {
    goUserDetail(val) {
      //跳转到用户详情页
      console.log("跳到用户 " + val + " 的详情页");
      this.$router.push("/user/" + this.myId + "/" + val);
    },
    goWorkDetail(val) {
      //跳转到用户详情页
      console.log("跳到作品 " + val + " 的详情页");
      this.$router.push("/invitation/" + this.myId + "/" + val);
    },
    goBackClick() {
      this.$router.go(-1);
    }, //返回按钮
    replyCommentClick(id, name) {
      //点击跳出评论评论弹窗
      this.replyCommentid = id;
      this.userName = name;
      this.replyShow = true;
    },
    replayCommentConfirm(val) {
      //数据交互，将回复详情发给后端
      this.replyShow = false;
      this.replyComment = "";
      console.log("回复 " + val + " 评论");
    },
    replayCommentCancel() {
      this.replyShow = false;
      this.replyComment = "";
    }
  },
  mounted() {
    this.userid = this.$cookies.get("userid");
    this.msgList = [];
    get({
      url: "/api/my_messages?userid=" + this.userid
    })
      .then(res => {
        console.log("aaa");
        if (res.data.ok == 0) {
          this.msgList = [];
          return;
        }
        res.data.data.forEach(element => {
          this.msgList.push(element);
        });
      })
      .catch(res => {
        this.msgList = [];
      });
  }
};
</script>

<style scoped>
.divider {
  background-color: rgba(0, 0, 0, 0.1);
  height: 1px;
  width: 100%;
  bottom: 12px;
  top: 12px;
}

.title {
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: #ffc800;
}

.back-button {
  border: 0px;
  padding-left: 0px;
  padding-bottom: 0px;
  background-color: #ffc800;
}

.user-info-row {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
  height: 20px;
}

.user-info-name {
  padding-left: 1px;
  height: 20px;
  font-size: 14px;
}

.user-info-time {
  padding-left: 1px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
}

.user-info-img {
  border-radius: 6px;
  height: 30px;
  width: 30px;
}

.msg-type-row {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 10px;
  height: 10px;
  font-size: 12px;
}

.msg-detail-row {
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  height: 10px;
}

.van-ellipsis {
  font-size: 14px;
  border: 0px;
  padding-left: 15px;
  background-color: white;
  color: rgba(0, 0, 0, 1);
  height: 20px;
}

.replybtn {
  font-size: 14px;
  border: 0px;
  background-color: white;
  color: #459cfc;
  height: 20px;
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
  width: 110px;
}
</style>