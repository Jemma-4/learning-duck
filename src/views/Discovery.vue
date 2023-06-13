<template>
  <div id="discovery">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    <van-tabs v-model="active" color="steelblue" sticky :offset-top="90">
      <!--这些个页面之下的内容来自推荐-->
      <!--关注底下的页面-->
      <van-tab title="关注">
        <!--底下的贴子列表-->
        <div style="height:15px;" />
        <invitation-detail-list :url="discoverUrl" :userId="userId" para :type="1" />
      </van-tab>
      <!--圈子底下的页面-->
      <van-tab title="圈子">
        <group-list :url="discoverUrl" :userId="userId" para :type="3" />
      </van-tab>
      <!--话题底下的页面-->
      <van-tab title="话题">
        <hot-tag-list :url="discoverUrl" :userId="userId" para :type="4" />
      </van-tab>
      <!--推荐底下的页面-->
      <van-tab title="推荐">
        <invitation-list :url="discoverUrl" :userId="userId" para :type="2" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import InvitationList from "../views/InvitationList.vue";
import InvitationDetailList from "../views/InvitationDetailList.vue";
import GroupList from "../views/GroupList.vue";
import UserList from "../views/UserList.vue";
import HotTagList from "../views/HotTagList.vue";

export default {
  name: "Discovery",
  components: {
    InvitationList,
    InvitationDetailList,
    GroupList,
    UserList,
    HotTagList
  },
  data() {
    return {
      userId: 0,
      discoverUrl: "discover",
      keyword: "",
      active: 0,
      count: 0,
      isLoading: false,
      postList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    };
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.count++;
      }, 1000);
    }
  },
  mounted(){
    this.userId = this.$cookies.get("userid");
  }
};
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}

#post {
  width: 165px;
}

.postList {
  margin: 15px;
  display: flow;
}

.postItem {
  position: relative;
  margin: 0px auto;
  float: right;
  display: flow;
}

.postItemLeft {
  position: relative;
  margin: 0px auto;
  float: left;
  display: flow;
}
</style>