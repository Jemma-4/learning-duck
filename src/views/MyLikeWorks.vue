<template>
  <div id="MyLikeWorks">
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
        >我赞过的作品</div>
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
              :src="item.userImg"
              fit="cover"
              round
              @click="goUserDetail(item.userId)"
              class="user-info-img"
            ></van-image>
          </van-col>

          <van-col span="17">
            <van-row>
              <div class="user-info-name">{{item.userName}}</div>
            </van-row>

            <van-row>
              <div class="user-info-releaseTime">{{item.releaseTime}}发表</div>
            </van-row>
          </van-col>

          <van-col span="5">
            <van-button
              v-show="!item.isFollow"
              class="user-follow-button"
              @click="followClick(item)"
            >关注</van-button>

            <van-button
              v-show="item.isFollow"
              class="user-followed-button"
              @click="followClick(item)"
            >已关注</van-button>
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
            <van-image
              :src="require('../assets/comments.png')"
              fit="cover"
              round
              class="comment-img"
            ></van-image>
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
    <div
      style="font-size:16px;padding-top:10px;padding-bottom:10px;color:rgba(0, 0, 0, 0.45);;text-align:center"
    >没有更多内容了</div>
  </div>
</template>

<script>
import { get } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "MyLikeWorks",
  data() {
    return {
      userid: 0,
      worksList: [
        //相关评论列表，点击用户名可跳转用户详情页
        {
          id: 1,
          userId: 112221,
          workId: 1,
          userName: "谈踩踩",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          releaseTime: "2019-12-05",
          isFollow: false,
          content: "刘佬强啊",
          likenums: 2333,
          commentnums: 666
        },
        {
          id: 2,
          userId: 112222,
          workId: 1,
          userName: "谈菜菜",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          releaseTime: "2020-07-12",
          isFollow: true,
          content: "张佬强啊",
          likenums: 2333,
          commentnums: 555
        },
        {
          id: 3,
          userId: 112223,
          workId: 1,
          userName: "谈弟弟",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          releaseTime: "2020-06-29",
          isFollow: false,
          content: "陆佬强啊",
          likenums: 2333,
          commentnums: 512
        }
      ] //相关评论列表
    };
  },
  methods: {
    goBackClick() {
      this.$router.go(-1);
    },
    followClick(item) {
      //关注按钮响应
      get({
        url: "/api/follow",
        params: {
          userid: this.userid,
          careid: item.userId
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            if (res.data.status == 1) {
              Toast("关注成功");
              item.isFollow = true;
            } else {
              Toast("取消关注");
              item.isFollow = false;
            }
          }
        })
        .catch(res => {
          Toast("加载失败");
        });
    },
    goUserDetail(val) {
      //跳转到用户详情页
      console.log("跳到用户 " + val + " 的详情页");
      this.$router.push("/user/" + this.myId + "/" + val);
    },
    goWorkDetail(val) {
      //跳转到作品详情页
      console.log("跳到作品 " + val + " 的详情页");
      this.$router.push("/invitation/" + this.myId + "/" + val);
    }
  },
  mounted() {
    this.userid =  this.$cookies.get("userid");
    this.worksList = [];
    get({
      url: "/api/my_likeworks?userid=" + this.userid
    })
      .then(res => {
        console.log("aaa");
        if (res.data.ok == 0) {
          this.worksList = [];
          return;
        }
        res.data.data.forEach(element => {
          this.worksList.push(element);
        });
      })
      .catch(res => {
        this.worksList = [];
      });
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