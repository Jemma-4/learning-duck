<template>
  <div>
    <!--自习室上面的导航栏-->
    <van-nav-bar
      id="navBar"
      title="自习室"
      left-text="返回"
      right-text="选项"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <!--自习室配图-->
    <van-image fit="cover" :src="require('../assets/background/1.png')" id="backImage" />
    <!--自习室的信息框-->
    <van-row id="infoBar">
      <van-col span="18">
        <b id="roomTitle">{{roomname}}的用户排行</b>
      </van-col>
      <van-col span="3">
        <van-tag plain type="primary">{{userCount}}人</van-tag>
      </van-col>
      <van-col span="3">
        <van-tag color="#f2826a">{{roomMaxNum}}人</van-tag>
      </van-col>
    </van-row>
    <!--自习室底下的用户排行-->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        id="rankList"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in userList" :key="item.userid">
          <van-row>
            <van-col span="12" id="userNameWord">{{item.username}}</van-col>
            <van-col span="12">今日{{item.entertime}}进入自习室</van-col>
            <van-col span="12" offset="12" id="studyTimeWord">学习时长{{item.studytime}}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!--点击加入自习室之后的底部弹框-->
    <van-popup
      class="bottomPopup"
      v-model="showBottomPopup"
      position="bottom"
      :style="{ height: '20%' }"
    >
      <van-cell class="bottomPopup">
        <van-button plain type="info" class="infoButton" @click="onExitRoom">退出自习室</van-button>
        <van-button plain type="info" class="infoButton" @click="onCancelPopup">取消</van-button>
      </van-cell>
    </van-popup>
  </div>
</template>

<script>
import { get } from "../router/request.js";
export default {
  name: "InnerLearningRoom",
  data() {
    return {
      //加入自习室的信息，希望能从用户那里搞到
      roomid: 5,
      roomname: "自习室1",
      userid: 0,
      userCount: 20,
      roomMaxNum: 30,
      list: [],
      loading: false,
      finished: false,
      refreshing: true,
      userList: [
        {
          username: "用户1",
          userid: 1,
          studytime: "3小时",
          entertime: "12:30",
        },
        { username: "用户2", userid: 2, studytime: "2小时", entertime: "没有" },
        {
          username: "用户3",
          userid: 3,
          studytime: "1分钟",
          entertime: "11:11",
        },
      ],
      showBottomPopup: false,
      rankPage:-1,
    };
  },
  methods: {
    //导航栏上面点击返回的响应函数
    onClickLeft() {
      this.$router.push("/home/efficiency/list");
    },
    //导航栏上面点击选项的响应函数
    onClickRight() {
      this.showBottomPopup = true;
    },
    //退出自习室的响应函数
    onExitRoom() {
      get({
        url: "/api/createStudyRecord",
        params: {
          target: "自习室",
          userid: this.userid,
          iscompleted: 1,
          type: 2,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 600,
            });
          } else {
            this.$router.push("/selfstudy")
            //此处更新cookie(inRoom/Roomid/Roomname)
            this.$cookies.set("inRoom", 0);
            this.$notify({
              type: "success",
              message: "退出成功",
              duration: 500,
            });
          }
          
        })
        .catch((res) => {
          this.$notify({
            type: "danger",
            message: "服务器连接失败",
            duration: 600,
          });
        });
      console.log("退出自习室");
    },

    //取消底部弹窗的响应函数
    onCancelPopup() {
      this.showBottomPopup = false;
    },
    //下拉刷新的俩函数
    onLoad() {
      setTimeout(() => {
        console.log(this.finished);
        if (this.refreshing) {
          this.userList = [];
          this.rankPage = -1;
          this.maxNum = 0;
          this.refreshing = false;
        }
        this.rankPage += 1;
        get({
          url: "/api/getRoomSituation",
          params: {
            roomid: this.roomid,
            page: this.rankPage,
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.ok == 1) {
              this.maxNum = res.data.max;
              this.userCount = res.data.max;
              this.roomname=res.data.roomname;
              this.roomMaxNum = res.data.limit;
              res.data.data.forEach((element) => {
                this.userList.push(element);
              });
              this.loading = false;
            }
            if (this.userList.length >= this.maxNum) {
              this.finished = true;
            }
          })
          .catch((res) => {
            this.finished = true;
          });
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  mounted(){
    this.userid = this.$cookies.get("userid");
    this.roomid = this.$route.params.roomId;
    console.log( this.roomid);
  }
};
</script>

<style scoped>
#navBar {
  background-color: #ffc800;
}

/deep/ .van-ellipsis {
  color: white;
}

/deep/ .van-nav-bar .van-icon {
  color: white;
}

/deep/ .van-nav-bar__text {
  color: white;
}

#backImage {
  /* position: absolute;
  top: 0px; */
  margin: 0px;
  width: 100%;
  height: 100%;
  /* z-index: -1; */
}

#infoBar {
  margin: 0px;
  padding-top: 0px;
  padding-bottom: 10px;
}

#roomTitle {
  margin: 5px;
  text-align: left;
  color: black;
  font-size: 16px;
}

#rankList {
}

#userNameWord {
  font-size: 16px;
}

#studyTimeWord {
  color: #39a9ed;
}

.bottomPopup {
  background-color: transparent;
}

.infoButton {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
}
</style>