<template>
  <div class="container">
    <van-sticky :offset-top="0" class="top">
      <van-row class="top-tochose" type="flex" align="bottom">
        <!-- 第一个按钮为添加番茄钟/长期计划/待办清单的功能 -->
        <van-col span="3">
          <van-button
            round
            size="large"
            :icon="require('../assets/message-white.png')"
            class="button"
            @click="goMessage()"
          />
        </van-col>
        <!-- 会以弹窗的形式展现一些用户信息 -->
        <van-col span="18">
          <div class="title">圈子</div>
        </van-col>
        <!-- 会跳转到自习室相关页面 -->
        <van-col span="3">
          <van-button round size="large" :icon="require('../assets/selfstudy.png')" class="button" />
        </van-col>
      </van-row>
    </van-sticky>

    <van-cell title="我的圈子" is-link id="groupBar" />
    <div id="groupList">
      <div
        v-for="(item,i) in groupList"
        :key="i"
        class="groupItem"
        @click="choseThisGroup(item.groupid)"
      >
        <van-image
          height="100px"
          width="100px"
          radius="10px"
          class="groupImage"
          fit="fill"
          round
          v-if="i>=1"
          :src="item.backgroundimage"
        />
        <p class="groupDescribe" 
        v-if="i>=1">{{item.groupname}}</p>
        <van-image
          height="100px"
          width="100px"
          radius="10px"
          class="groupImage-create"
          fit="fill"
          round
          v-if="i==0"
          @click.stop="goCreate()"
          :src="require('../assets/'+item.backgroundimage+'.png')"
        />
        <p class="groupDescribe" 
        v-if="i==0">{{item.groupname}}</p>
      </div>
    </div>
    <div style="height:10px;background-color:rgba(0,0,0,0.05)" />
    <div class="group-title">圈子动态</div>
    <van-tabs v-model="active" color="steelblue" sticky :offset-top="80">
      <!--搜索出来的综合结果-->
      <van-tab title="热度">
        <div style="height:15px;" />
        <invitation-detail-list :url="url" :userId="userId" para :type="7" />
      </van-tab>
      <!--搜索出的相关用户-->
      <van-tab title="时间">
        <invitation-detail-list :url="url" :userId="userId" para :type="1" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { get, post } from "../router/request.js";
import { Toast } from "vant";
import InvitationDetailList from "../views/InvitationDetailList.vue";

export default {
  name: "GroupBar",
  components: {
    InvitationDetailList
  },
  data() {
    return {
      userId: 1000,
      active: 0,
      url: "getWorkList",
      groupList: [
        { id: 0,
         groupname: "创建圈子",
         backgroundimage:"create", groupId: 1 },
        // { id: 2, name: "圈子", groupId: 1 },
        // { id: 3, name: "圈子", groupId: 1 },
        // { id: 4, name: "圈子", groupId: 1 },
        // { id: 5, name: "圈子", groupId: 1 },
        // { id: 6, name: "圈子", groupId: 1 }
      ]
    };
  },
  methods: {
    choseThisGroup(val) {
      this.$router.push("/group/" + this.userId + "/" + val);
    },
    goMessage() {
      this.$router.push("/message");
    },
    goCreate(){
      this.$router.push("/creategroup");
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
    get({
      url: "/api/getGroupList",
      params: {
        userid: this.userId,
        page: this.groupPage,
        num: 30
      }
    })
      .then(res => {
        if (res.data.ok == 1) {
          res.data.groupList.forEach(element => {
            // element.id = 1;
            this.groupList.push(element);
          });
        }
      })
      .catch(res => {
        Toast("加载失败");
      });
  }
};
</script>

<style scoped>
.container {
  width: 375px;
}

#groupBar {
}

#groupList {
  display: flex;
  height: 140px;
  overflow: scroll;
}

.groupItem {
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100px;
  height: 120px;
}

.groupImage {
  margin: 0px;
  padding: 0px;
}

.groupImage-create {
  margin: 0px;
  padding: 0px;
}

.groupDescribe {
  margin: 0px;
  padding: 0px;
  font-size: 14px;
  text-align: center;
}

.group-title {
  padding-left: 15px;
  font-size: 20px;
  height: 60px;
  line-height: 60px;
}
.title {
  font-size: 20px;
  color: white;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.top {
  background-color: #ffc800;
  height: 90px;
}
.top-tochose {
  background-color: #ffc800;
  height: 90px;
}
.button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
}
</style>