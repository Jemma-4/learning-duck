<template>
  <div id="Follow">
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
        >我的关注</div>
      </van-col>
      <van-col span="3"></van-col>
    </van-row>

    <div class="divider"></div>
    <div class="follow-list">
      <div v-for="item in followList" :key="item.id" class="follow-item">
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
              <div class="user-info-date">
                <van-col>
                  <div class="worknums">作品:{{item.worknums}}</div>
                </van-col>

                <van-col>
                  <div class="fansnum">粉丝:{{item.fansnum}}</div>
                </van-col>
              </div>
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
  name: "Follow",
  data() {
    return {
      userid: 0,
      followList: [
        //相关评论列表，点击用户名可跳转用户详情页
        {
          id: 1,
          userId: 112221,
          userName: "陆佬",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          worknums: 16,
          fansnum: 49,
          isFollow: false
        },
        {
          id: 2,
          userId: 112222,
          userName: "太",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          worknums: 16,
          fansnum: 49,
          isFollow: false
        },
        {
          id: 3,
          userId: 112223,
          userName: "牛逼",
          userImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          worknums: 16,
          fansnum: 49,
          isFollow: false
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
      if (item.isFollow) {
        //数据交互
        get({
          url: "/api/follow?userid=" + this.userid + "&careid=" + item.userId
        })
          .then(res => {
            console.log(res.data);
            if (res.data.ok == 0) {
              Toast("操作失败");
              return;
            }
            item.isFollow = !item.isFollow;
            console.log(item.isFollow);
            Toast("取消关注 " + item.userName);
          })
          .catch(res => {
            Toast("操作失败");
          });
      } else {
        get({
          url: "/api/follow?userid=" + this.userid + "&careid=" + item.userId
        })
          .then(res => {
            console.log(res.data);
            if (res.data.ok == 0) {
              Toast("操作失败");
              return;
            }
            item.isFollow = !item.isFollow;
            console.log(item.isFollow);
            Toast("关注 " + item.userName + " 成功");
          })
          .catch(res => {
            Toast("操作失败");
          });
      }
    },
    goUserDetail(val) {
      //跳转到用户详情页
      this.$router.push("/user/" + this.userid + "/" + val);
      console.log("跳到用户 " + val + " 的详情页");
    }
  },
  mounted() {
    this.userid = this.$cookies.get("userid");
    this.followList = [];
    get({
      url: "/api/my_follows?userid=" + this.userid
    })
      .then(res => {
        console.log("aaa");
        if (res.data.ok == 0) {
          return;
        }
        res.data.data.forEach(element => {
          this.followList.push(element);
        });
      })
      .catch(res => {
        this.followList = [];
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

.worknums {
  padding-left: 1px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.fansnum {
  padding-left: 15px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
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
</style>