<template>
  <div id="tag-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        success-text="刷新成功"
        @load="onLoad"
      >
        <div class="tagList">
          <div v-for="(item,id) in tagList" :key="id" @click="choseThis(item.tagid)">
            <van-row class="tag-row">
              <van-col span="3">
                <van-button size="large" class="tag-button" :icon="require('../assets/search.png')"></van-button>
              </van-col>
              <van-col span="13">
                <div class="tag-name">{{item.tagname}}</div>
              </van-col>
              <van-col span="5">
                <div class="tag-num">讨论数 {{item.worknums}}</div>
              </van-col>
            </van-row>
            <div style="height:1px;background-color:rgba(0,0,0,0.05)" />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { get, post } from "../router/request.js";

export default {
  name: "TagList",
  props: {
    //对接
    // userId: 0,
    url: "", // search
    type: 0,
    para: "" // 搜索关键词
  },
  data() {
    return {
      userId: 0,
      tagList: [
        // {
        //   tagid: 1,
        //   tagname: "番茄",
        //   worknums: 100
        // }
      ],
      loading: false,
      finished: false,
      refreshing: false,
      // userId: 1000, // 传入用户id
      // keyword: "tag", // 传入搜索关键词
      page: 0,
      maxNum: 0
    };
  },
  methods: {
    choseThis(val) {
      console.log("跳转到话题详情");
      this.$router.push("/tag/" + this.userId + "/" + val);
    },
    //下拉刷新列表的两个响应函数
    onLoad() {
      //   //对接：列表拉取
      if (this.refreshing) {
        this.tagList = [];
        this.refreshing = false;
      }
      this.page += 1;
      get({
        url: "/api/search",
        params: {
          userid: this.userId,
          keyword: this.para,
          page: this.page,
          num: 10, // 每页的条数
          type: 3 // 搜标签
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 1) {
            this.maxNum = res.data.max;
            // 这里拿数据
            res.data.tagList.forEach(element => {
              this.tagList.push(element);
            });
            this.loading = false;
          }
          if (this.tagList.length >= this.maxNum) {
            this.finished = true;
          }
        })
        .catch(res => {
          this.finished = true;
        });
    },
    onRefresh() {
      //   // 清空列表数据
      console.log("refresh");
      this.finished = false;
      this.page = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  },
  mounted() {
    this.userId = this.$cookies.get("userid");
  },
  watch: {
    $route: function(to, from) {
      this.tagList = [];
      this.onRefresh();

      // console.log(this.userList);
    }
  }
};
</script>

<style scoped>
.tag-row {
  height: 50px;
}
.tag-name {
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding-left: 35px;
}
.tag-button {
  border: 0px;
}

.tag-num {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
  height: 50px;
  line-height: 50px;
}
</style>