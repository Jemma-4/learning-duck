<template>
  <div>
    <!--圈子审核的主体-->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        style="background-color: rgba(255,255,255,0.9)"
        @load="onLoad"
      >
        <van-cell v-for="item in applyList" :key="item.eid">
          <van-row>
            <van-col span="24">
              来自用户
              <b class="markWord">{{item.username}}</b> 的
              <b class="markWord">{{item.groupname}}</b> 圈子创建申请
            </van-col>
            <van-col span="5" offset="14">
              <van-button type="info" class="infoButton" @click="onUserDetail(item.userid)">用户信息</van-button>
            </van-col>
            <van-col span="5">
              <van-button type="info" class="infoButton" @click="onGroupDetail(item)">查看详情</van-button>
            </van-col>
          </van-row>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!--圈子审核详情的弹窗-->
    <van-popup v-model="groupDetail" round id="groupDetailPopup">
      <van-cell :title="currentGroupName" id="groupDetailTitle" is-link arrow-direction="down" />
      <van-image fit="cover" height="150" :src="currentImage" />
      <van-field v-model="currentDescription" label="描述" readonly />
      <van-field v-model="currentNotice" label="公告" :border="false" readonly />
      <van-divider class="divider" hairline dashed />
      <van-field v-model="currentReason" label="原因" readonly />
      <van-row gutter="0" id="buttonGroup">
        <van-col span="12">
          <van-button id="rejectButton" plain type="info" :block="true" @click="onRejectGroup">拒绝</van-button>
        </van-col>
        <van-col span="12">
          <van-button id="acceptButton" plain type="info" :block="true" @click="onAcceptGroup">同意</van-button>
        </van-col>
      </van-row>
    </van-popup>
    <!--用户信息详情的弹窗-->
    <van-popup v-model="userDetail" round id="userDetailPopup">
      <van-cell title="圈主详情" id="userDetailTitle" is-link arrow-direction="down" />
      <van-row gutter="10" id="userInfoBar">
        <van-col span="8" id="userHeadImage">
          <van-image fit="fill" :src="currentHeadImage" />
        </van-col>
        <van-col span="16">
          <van-field v-model="currentUserId" label="用户名" readonly class="userInfoWord" />
          <van-field v-model="currentUserId" label="用户id" readonly class="userInfoWord" />
          <van-tag color="#ffc800" id="eggTag">鸭蛋:{{currentEggNumber}}</van-tag>
          <van-tag
            :color="currentStatus == 0 ? '#459cfc':'#FF0000' "
            id="statusTag"
          >{{currentStatus==0? '正常状态' : '已封禁' }}</van-tag>
        </van-col>
      </van-row>
      <van-divider class="innerDivider" />
      <van-button id="backButton" plain type="info" :block="true" @click="onBack">返回</van-button>
    </van-popup>
  </div>
</template>

<script>
import { get } from "../router/request.js";
export default {
  name: "ApplyList",
  data() {
    return {
      userid: 1000000,
      list: [],
      loading: false,
      finished: false,
      refreshing: true,
      groupDetail: false,
      userDetail: false,
      applyList: [
      ],
      //当前圈子的详情信息
      currentEid: "",
      currentGroupName: "",
      currentDescription: "",
      currentImage: "",
      currentNotice: "",
      currentReason: "",
      //当前用户信息
      currentUserName: "",
      currentUserId: 0,
      currentHeadImage: "",
      currentEggNumber: 666,
      currentStatus: 0,
      applyPage: -1,
      allNum: 0,
    };
  },
  methods: {
    //查看圈子申请详情的响应函数
    onGroupDetail(groupItem) {
      //显示圈子详情的一级弹窗
      this.currentEid = groupItem.eid;
      this.currentGroupName = groupItem.groupname;
      this.currentDescription = groupItem.description;
      this.currentImage = groupItem.image;
      this.currentNotice = groupItem.notice;
      this.currentReason = groupItem.reason;

      this.groupDetail = true;
    },
    //拒绝这个圈子申请的响应函数
    onRejectGroup() {
      this.groupDetail = false;
      //被拒绝事件的eid
        get({
          url: "/api/adminHandle",
          params: {
            userid: this.userid,
            eid:this.currentEid,
            result:-1
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.ok == 1) {
              this.deleteEventFromList();
            }
          })
          .catch((res) => {});
      
    },
    //接受这个圈子申请的响应函数
    onAcceptGroup() {
      this.groupDetail = false;
      //被接受事件的eid
        get({
          url: "/api/adminHandle",
          params: {
            userid: this.userid,
            eid:this.currentEid,
            result:1
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.ok == 1) {
              this.deleteEventFromList();
            }
          })
          .catch((res) => {});
      
    },
    //删除列表中相应的记录
    deleteEventFromList() {
      for (let i = 0; i < this.applyList.length; i++) {
        if (this.applyList[i].eid == this.currentEid)
          this.applyList.splice(i, 1);
      }
    },
    //查看用户详情的响应函数
    onUserDetail(uid) {
      //显示用户详情的一级弹窗
      //我这里写死了，其实需要根据uid获取这些数据
      this.currentUserId = uid;

        get({
          url: "/api/getUserInfo",
          params: {
            userid: this.currentUserId,
            myid: this.userid,
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.ok == 1) {
              this.currentUserName = res.data.username;
              this.currentHeadImage = res.data.headImage;
              this.currentEggNumber = res.data.credit;
              this.currentStatus = res.data.status; //0正常, 1被封禁
            }
          })
          .catch((res) => {});

      this.userDetail = true;
    },
    //返回按钮的响应函数
    onBack() {
      this.userDetail = false;
    },
    //下拉刷新的两个函数
    onLoad() {
        console.log(this.finished);
        if (this.refreshing) {
          this.applyList = [];
          this.applyPage = -1;
          this.allNum = 0;
          this.refreshing = false;
        }
        this.applyPage += 1;
        get({
          url: "/api/adminGetEvents",
          params: {
            userid: this.userid,
            page: this.applyPage,
            type: 3,
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.ok == 1) {
              this.allNum = res.data.max;
              res.data.data.forEach((element) => {
                this.applyList.push(element);
              });
              this.loading = false;
            }
            if (this.applyList.length >= this.allNum) {
              this.finished = true;
            }
          })
          .catch((res) => {
            this.finished = true;
          });
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
    if(this.$cookies.isKey("admin") == false){
      Toast("请重新登录");
      this.$router.push("/login");
    }else{
      this.userid = this.$cookies.get("admin");
    }
  }
};
</script>

<style scoped>
.markWord {
  color: #459cfc;
}

/deep/ .van-cell .van-icon {
  color: white;
}

.infoButton {
  padding: 5px;
  height: auto;
  margin-top: 4px;
}

#groupDetailPopup {
  width: 86%;
}

#userDetailPopup {
  width: 86%;
}

#userDetailTitle {
  background-color: #459cfc;
  color: white;
  font-size: 16px;
}

#groupDetailTitle {
  background-color: #459cfc;
  color: white;
  font-size: 16px;
}

.innerDivider {
  margin: 0px;
}

.divider {
  margin: 3px;
}

#rejectButton {
  border: none;
}

#acceptButton {
  border: none;
}

#backButton {
  border: none;
}

#buttonGroup {
  width: 100%;
}

#userInfoBar {
  margin: 0px;
}

#userHeadImage {
  padding-top: 7px;
  padding-left: 7px;
}

.userInfoWord {
  font-size: 12px;
  margin-bottom: 0px;
}

#eggTag {
  font-size: 12px;
  margin-top: 0px;
  padding-top: 0px;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 10px;
  margin-right: 10px;
  float: left;
}

#statusTag {
  font-size: 12px;
  margin-top: 0px;
  padding-top: 0px;
  padding-left: 8px;
  padding-right: 8px;
  float: left;
}
</style>