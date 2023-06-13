<template>
  <div id="search-result">
    <van-tabs v-model="active" color="steelblue" sticky :offset-top="90">
      <!--搜索出来的综合结果-->
      <van-tab title="综合">
        <div style="height:15px;" />
        <invitation-detail-list :url="allUrl" :userId="userId" :para="keyword" :type="1" />
      </van-tab>
      <!--搜索出的相关用户-->
      <van-tab title="用户">
        <user-list :url="allUrl" :userId="userId" :para="keyword" :type="0" />
      </van-tab>
      <!--搜索出的相关圈子-->
      <van-tab title="圈子">
        <group-list :url="allUrl" :userId="userId" :para="keyword" :type="2" />
      </van-tab>
      <!--搜索出的相关话题-->
      <van-tab title="话题">
        <tag-list :url="allUrl" :userId="userId" :para="keyword" :type="3" />
      </van-tab>
      <!--推荐底下的页面-->
    </van-tabs>
  </div>
</template>

<script>
import InvitationList from "../views/InvitationList.vue";
import InvitationDetailList from "../views/InvitationDetailList.vue";
import GroupList from "../views/GroupList.vue";
import UserList from "../views/UserList.vue";
import TagList from "../views/TagList.vue";

export default {
  name: "SearchResult",
  components: {
    InvitationList,
    InvitationDetailList,
    GroupList,
    UserList,
    TagList
  },
  data() {
    return {
      userId: 0,
      allUrl: "search",
      recommendUrl: "",
      keyword: "", // 搜索关键词
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
  mounted() {
    console.log("here");
    this.userId = this.$cookies.get("userid");
    this.keyword = this.$route.params.keyword;
  },
  watch: {
    $route: function(to, from) {
      this.keyword = this.$route.params.keyword;
    }
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