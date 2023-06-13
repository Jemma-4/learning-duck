<template>
  <div id="MyWorks">
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
        >我的作品</div>
      </van-col>
      <van-col span="3"></van-col>
    </van-row>
    <div class="divider"></div>
    <div class="work-list">
      <div v-for="item in worksList" :key="item.id" class="work-item">
        <!-- 用户信息栏，头像，名称，日期，关注按钮 -->

        <van-row class="user-info-row" type="flex" justify="start" align="center">
          <van-col span="3">
            <!-- 头像 -->
            <van-image
              :src="userImg"
              fit="cover"
              round
              @click="goUserDetail(userId)"
              class="user-info-img"
            ></van-image>
          </van-col>

          <van-col span="17">
            <van-row>
              <div class="user-info-name">{{userName}}</div>
            </van-row>

            <van-row>
              <div class="user-info-releaseTime">{{item.releaseTime}}发表</div>
            </van-row>
          </van-col>
        </van-row>

        <van-row
          class="work-content-row"
          type="flex"
          justify="start"
          align="center"
          @click="goWorkDetail(item.workId)"
        >{{item.content}}</van-row>

        <van-row class="like-comment-row" type="flex" justify="start" align="center">
          <van-col span="3">
            <!-- 点赞 -->
            <van-image :src="require('../assets/heart.png')" fit="cover" round class="like-img"></van-image>
          </van-col>

          <van-col span="10">
            <van-row>
              <div class="like-nums">{{item.likenums}}</div>
            </van-row>
          </van-col>

          <van-col span="3">
            <!-- 评论 -->
            <van-image :src="require('../assets/comments.png')" fit="cover" round class="comment-img"></van-image>
          </van-col>

          <van-col span="10">
            <van-row>
              <div class="comment-nums">{{item.commentnums}}</div>
            </van-row>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="divider"></div>
    <div style="font-size:16px;padding-top:10px;padding-bottom:10px;color:rgba(0, 0, 0, 0.45);;text-align:center">没有更多内容了</div>
  </div>
</template>

<script>
import {get} from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "MyWorks",
  data() {
    return {
      userId: 0,
      userName: "谈踩踩",
      userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
      worksList: [] //相关评论列表
    };
  },
  methods: {
    goBackClick(){
      this.$router.go(-1);
    },
    goUserDetail(val) {
      //跳转到用户详情页
      console.log("跳到用户 " + val + " 的详情页");
    },goWorkDetail(val) {
      //跳转到作品详情页
      this.$router.push("/invitation/" + this.myId + "/" + val);
      console.log("跳到作品 " + val + " 的详情页");
    },
  },
  mounted(){
    this.userId = this.$cookies.get("userid");
    this.worksList=[]
    get({
      url:"/api/my_works?userid="+this.userId
    })
    .then(res=>{
       console.log('aaa');
        if(res.data.ok==0){
          this.worksList=[];
          return;
        }
        this.userName=res.data.userName
        this.userImg=res.data.userImg
        res.data.data.forEach(element=>{
          this.worksList.push(element)
        })
    })
    .catch(res=>{
      this.worksList=[];
    })
  }
};
</script>

<style scoped>

.divider {
  background-color: rgba(0, 0, 0, 0.1);
  height: 1px;
  width: 100%;
}

.fans-list {
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

.user-info-releaseTime {
  padding-left: 15px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.user-info-img {
  height: 40px;
  width: 40px;
}

.work-content-row {
  padding-left: 25px;
  padding-top: 15px;
  height: 30px;
  font-size: 12px;
  
}

.like-comment-row {
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: 40px;
}

.like-img {
  padding-left: 15px;
  height: 20px;
  width: 20px;
}

.like-nums {
  padding-left: 1px;
  height: 15px;
  font-size: 12px;
}

.comment-img {
  padding-left: 15px;
  height: 20px;
  width: 20px;
}

.comment-nums {
  padding-left: 1px;
  height: 15px;
  font-size: 12px;
}
</style>