<template>
  <div>
    <!--自习室界面的背景-->
    <van-image fit="fill" :src="require('../assets/background/learningBack.jpg')" id="backImage" />
    <!--自习室上面的导航栏-->
    <van-nav-bar
      id="navBar"
      title="自习室"
      left-text="返回"
      right-text="选项"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <!--导航栏下面二选一的选择组件-->
    <van-tabs type="card" id="tab" color="rgba(255,216,0,0.5)">
      <van-tab title="番茄自习室">
        <!--番茄自习室里面的两个按钮-->
        <van-button
          type="primary"
          id="createLearningRoomButton"
          :round="true"
          @click="onCreateRoom"
        >创建自习室</van-button>
        <van-button
          @click="onEnterRoom"
          type="primary"
          id="enterLearningRoomButton"
          :round="true"
        >加入自习室</van-button>
      </van-tab>
      <!----------------------------------------------------------------------------------------->
      <van-tab title="应用排行榜" id="rankTab">
        <!--排行榜里的列表-->
        <ApplicationRank />
      </van-tab>
      <!----------------------------------------------------------------------------------------->
    </van-tabs>
    <!--点击创建自习室之后的弹框-->
    <van-popup
      v-model="createRoom"
      id="createRoomPopup"
      closeable
      round
      close-icon-position="top-right"
      :close-icon="require('../assets/close.png')"
      class="add-clock-popup"
    >
      <van-cell-group>
        <van-field v-model="roomName" label="自习室名称" placeholder="请输入自习室名" />
        <van-field v-model="upperBound" label="人数上限" placeholder="50" :readonly="defineNotAllow" />
      </van-cell-group>
      <van-cell center title="公开此自习室">
        <template #right-icon>
          <van-switch v-model="open" size="24" inactive-color="gray" />
        </template>
      </van-cell>
      <p class="explainWord">若不公开，则仅可以通过加入码加入。</p>
      <van-cell center title="自定义人数上限">
        <template #right-icon>
          <van-switch
            @change="onDefineUpperBound"
            v-model="defineUpperBound"
            size="24"
            inactive-color="gray"
          />
        </template>
      </van-cell>
      <p class="explainWord">默认人数上限为50人，可自定义的范围是2~300人</p>
      <van-row gutter="0" id="buttonGroup">
        <van-col span="12">
          <van-button
            @click="onCancelCreateRoom"
            id="createCancelButton"
            plain
            type="info"
            :block="true"
          >取消</van-button>
        </van-col>
        <van-col span="12">
          <van-button @click="onCreateRoomOk" id="createOkButton" plain type="info" :block="true">确认</van-button>
        </van-col>
      </van-row>
    </van-popup>
    <!--点击加入自习室之后的底部弹框-->
    <van-popup
      class="bottomPopup"
      v-model="showBottomPopup"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-cell class="bottomPopup">
        <van-button plain type="info" class="infoButton" @click="onSearchOpenRoom">浏览或搜索公开自习室</van-button>
        <van-button plain type="info" class="infoButton" @click="onEnterRoomByID">通过输入加入码加入</van-button>
        <van-button plain type="info" class="infoButton" @click="onCancelPopup">取消</van-button>
      </van-cell>
    </van-popup>
    <!--浏览或搜索公开自习室的二层弹框-->
    <van-popup
      v-model="searchOpenRoom"
      id="roomList"
      duration="0.3"
      closeable
      round
      close-icon-position="top-right"
      :close-icon="require('../assets/close.png')"
      class="add-clock-popup"
    >
      <!--子组件，黄条条是子组件定义的-->
      <div class="head-background" />
      <van-list
        v-model="loadingOpenRoom"
        :finished="finishedOpenRoom"
        finished-text="没有更多了"
        @load="onLoadOpen"
      >
        <van-cell
          v-for="item in roomList"
          :key="item.roomid"
          @click="onClickOpenRoomItem(item.roomid, item.roomname)"
        >
          <van-row gutter="10">
            <van-col span="16">
              <b id="roomTitle">{{item.roomname}}</b>
            </van-col>
            <van-col span="4">
              <van-tag plain type="primary">{{item.userCount}}人</van-tag>
            </van-col>
            <van-col span="4">
              <van-tag color="#f2826a">{{item.roomMaxNum}}人</van-tag>
            </van-col>
          </van-row>
        </van-cell>
      </van-list>
    </van-popup>
    <!--点击输入加入码加入后的二层弹框-->
    <van-popup id="learningRoom" v-model="enterRoomByID" :round="true">
      <b style="font-size: 17px">加入自习室</b>
      <p class="noticeWord">输入自习室加入码即可加入</p>
      <p class="noticeWord">不区分大小写</p>
      <van-field v-model="roomID" label="加入码" placeholder="请输入加入码" />
      <van-divider class="innerDivider" />
      <van-row gutter="0" id="buttonGroup">
        <van-col span="12">
          <van-button
            @click="onCancelEnterRoomByID"
            id="cancelButton"
            plain
            type="info"
            :block="true"
          >取消</van-button>
        </van-col>
        <van-col span="12">
          <van-button id="okButton" @click="onEnterRoomByIDOk" plain type="info" :block="true">确认</van-button>
        </van-col>
      </van-row>
    </van-popup>
  </div>
</template>

<script>
import { get } from "../router/request.js";
import Vue from "vue";
import { Toast } from "vant";
import ApplicationRank from "../components/ApplicationRank";
Vue.use(Toast);

export default {
  name: "LearningRoom",
  components: { ApplicationRank },
  data() {
    return {
      userid: 0,
      openRoomlist: [],
      loadingOpenRoom: false,
      finishedOpenRoom: false,
      openRoomNumber: 30, //每次抽取30个自习室
      showBottomPopup: false,
      enterRoomByID: false,
      searchOpenRoom: false,
      createRoom: false,
      roomID: "",
      open: true,
      defineUpperBound: false,
      roomName: "",
      upperBound: 50,
      defineNotAllow: true,
      roomList: [
        { roomid: 4, roomname: "自习室4", userCount: 43, roomMaxNum: 50 },
        { roomid: 5, roomname: "自习室5", userCount: 22, roomMaxNum: 30 },
        { roomid: 1, roomname: "自习室1", userCount: 23, roomMaxNum: 50 },
        { roomid: 2, roomname: "自习室2", userCount: 33, roomMaxNum: 50 }
      ]
    };
  },
  methods: {
    //导航栏上面点击返回的响应函数
    onClickLeft() {
      this.$router.push("/home/efficiency/list");
    },
    //导航栏上面点击选项的响应函数
    onClickRight() {},
    //创建自习室按钮的响应函数
    onCreateRoom() {
      this.createRoom = true;
    },
    //创建自习室弹窗取消的响应函数
    onCancelCreateRoom() {
      this.createRoom = false;
    },
    //确认创建自习室的响应函数
    onCreateRoomOk() {
      //自习室名称不能为空
      if (this.roomName == "") {
        Toast("自习室名称不能为空");
      }
      //自习室人数上限位于2~300人之间
      else if (this.upperBound < 2 || this.upperBound > 300) {
        Toast("自习室人数不合理");
      } else {
        get({
          url: "/api/createRoom",
          params: {
            userid: this.userid,
            isPrivate: Number(!this.open),
            roomMaxNum: this.upperBound == "" ? 50 : Number(this.upperBound),
            // alarmtime: this.
            roomname: this.roomName
          }
        })
          .then(res => {
            console.log(res.data);
            if (res.data.ok == 0) {
              this.$notify({
                type: "warning",
                message: res.data.msg,
                duration: 600
              });
            } else {
              this.$cookies.set("inRoom", 1);
              this.$cookies.set("roomid", res.data.roomid);
              this.$cookies.set("roomname", this.roomName);
              this.$router.push("/learningroom/" + res.data.roomid);
              //此处更新cookie(inRoom/Roomid/Roomname)
              this.$notify({
                type: "success",
                message: "创建成功",
                duration: 500
              });
            }
          })
          .catch(res => {
            this.$notify({
              type: "danger",
              message: "服务器连接失败",
              duration: 600
            });
          });
        this.createRoom = false;
        //自习室名称+自习室人数上限+是否公开
        console.log(this.roomName);
        console.log(this.upperBound);
        console.log(this.open);
      }
    },
    //加入自习室按钮的响应函数
    onEnterRoom() {
      this.showBottomPopup = true;
    },
    //通过输入加入码加入自习室的响应函数
    onEnterRoomByID() {
      this.showBottomPopup = false;
      this.enterRoomByID = true;
    },
    //取消加入自习室的响应函数
    onCancelEnterRoomByID() {
      this.enterRoomByID = false;
    },
    //确认加入码加入自习室的响应函数
    onEnterRoomByIDOk() {
      if (this.roomID == "") {
        Toast("加入码不能为空");
      } else {
        this.enterRoomByID = false;
        get({
          url: "/api/joinRoom",
          params: {
            userid: this.userid,
            roomid: this.roomID
          }
        })
          .then(res => {
            console.log(res.data);
            if (res.data.ok == 0) {
              this.$notify({
                type: "warning",
                message: res.data.msg,
                duration: 600
              });
            } else {
              //此处更新cookie(inRoom/Roomid/Roomname)
              this.$cookies.set("inRoom", 1);
              this.$cookies.set("roomid", this.roomID);
              this.$cookies.set("roomname", this.roomName);
              this.$router.push("/learningroom/" + this.roomID);
              
              this.$notify({
                type: "success",
                message: "加入成功",
                duration: 500
              });
            }
          })
          .catch(res => {
            this.$notify({
              type: "danger",
              message: "服务器连接失败",
              duration: 600
            });
          });
        //自习室的加入码
        console.log(this.roomID);
      }
    },
    //取消底部弹窗的响应函数
    onCancelPopup() {
      this.showBottomPopup = false;
    },
    //浏览或搜索公开自习室的响应函数
    onSearchOpenRoom() {
      this.showBottomPopup = false;
      this.searchOpenRoom = true;
      this.finishedOpenRoom = true;
      get({
        url: "/api/getRoomList",
        params: {}
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 600
            });
          } else {
            this.roomList = res.data.data;
            this.$notify({
              type: "success",
              message: "获取自习室列表成功",
              duration: 500
            });
          }
        })
        .catch(res => {
          this.$notify({
            type: "danger",
            message: "服务器连接失败",
            duration: 600
          });
        });
    },
    //选中自习室的响应函数
    onClickOpenRoomItem(key, roomname) {
      //选中的自习室的roomId
      get({
        url: "/api/joinRoom",
        params: {
          userid: this.userid,
          roomid: key
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 600
            });
          } else {
            this.$cookies.set("inRoom", 1);
            this.$cookies.set("roomid", key);
            this.$cookies.set("roomname", roomname);
            this.$router.push("/learningroom/" + key);
            //此处更新cookie(inRoom/Roomid/Roomname)

            this.$notify({
              type: "success",
              message: "加入成功",
              duration: 500
            });
          }
        })
        .catch(res => {
          this.$notify({
            type: "danger",
            message: "服务器连接失败",
            duration: 600
          });
        });
      console.log(key);
      this.searchOpenRoom = false;
    },
    //公开自习室下拉刷新列表的响应函数
    onLoadOpen() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.openRoomlist.push(this.openRoomlist.length + 1);
        }

        // 加载状态结束
        this.loadingOpenRoom = false;

        // 数据全部加载完成
        if (this.openRoomlist.length >= this.openRoomNumber) {
          this.finishedOpenRoom = true;
        }
      }, 1000);
    },
    //创建自习室开启自定义人数上限的响应函数
    onDefineUpperBound() {
      //console.log(this.defineNotAllow);
      this.defineNotAllow = !this.defineNotAllow;
    },
  },
  mounted(){
    this.userid = this.$cookies.get("userid");
  }
};
</script>

<style scoped>
#backImage {
  position: fixed;
  width: 100%;
  height: 100%;
}

#navBar {
  position: fixed;
  top: 0px;
  padding-top: 40px;
  width: 100%;
  background-color: #ffc800;
}

#rankTab {
  position: fixed;
  left: 17.5px;
  overflow-y: scroll;
}

.innerDivider {
  margin: 0px;
}

#roomList {
  height: 400px;
  overflow: -moz-scrollbars-none;
}

#roomList::-webkit-scrollbar {
  width: 0 !important;
}

#roomTitle {
  margin: 5px;
  text-align: left;
  color: black;
}

.bottomPopup {
  background-color: transparent;
}

.infoButton {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border: 0px;
}

/deep/ .van-ellipsis {
  color: white;
  font-size: 20px;
}

/deep/ .van-nav-bar .van-icon {
  color: white;
  font-size: 30px;
}

/deep/ .van-nav-bar__text {
  color: white;
  font-size: 18px;
}

#tab {
  position: fixed;
  width: 60%;
  top: 12%;
  left: 20%;
  font-size: 30px;
}

#createLearningRoomButton {
  position: fixed;
  top: 25%;
  left: 36%;
  width: 100px;
  height: 100px;
  border: 0px;
  background-color: deepskyblue;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

#enterLearningRoomButton {
  position: fixed;
  top: 42%;
  left: 36%;
  width: 100px;
  height: 100px;
  border: 0px;
  background-color: steelblue;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

#learningRoom {
  width: 76%;
  text-align: center;
}

#cancelButton {
  border: none;
}

#okButton {
  border: none;
}

#buttonGroup {
  width: 100%;
  bottom: 0px;
  background-color: powderblue;
}

.noticeWord {
  font-size: 12px;
  margin: 1px;
}

.head-background {
  background-color: #ffc800;
  width: 300px;
  height: 40px;
}

#createRoomPopup {
  width: 90%;
}

#createCancelButton {
  border: none;
}

#createOkButton {
  border: none;
}

.explainWord {
  padding-left: 16px;
  margin-top: 0px;
  color: gray;
  font-size: 12px;
}
</style>