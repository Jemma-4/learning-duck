<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        style="background-color: rgba(255,255,255,0.9)"
        @load="onLoad"
      >
        <van-cell v-for="item in postList" :key="item.workid" :border="false" id="postList">
          <van-cell :title="item.title" icon="question-o" :border="false" />
          <van-field v-model="item.content" :border="false" readonly />
          <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(image, index) in item.userImage" :key="index">
              <van-image height="150" fit="cover" :src="image" />
            </van-swipe-item>
          </van-swipe>
          <van-row>
            <van-col span="6" offset="12">
              <van-button
                plain
                type="info"
                class="infoButton"
                @click="onIgnoreReport(item.eid)"
              >忽略举报</van-button>
            </van-col>
            <van-col span="6">
              <van-button type="info" class="infoButton" @click="onDeleteReport(item.eid)">删除贴子</van-button>
            </van-col>
          </van-row>
          <van-divider style="margin: 5px" />
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { get } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "ReportList",
  data() {
    return {
      userid: 1000000,
      list: [],
      loading: false,
      finished: false,
      refreshing: true,
      postList: [],
      currentWorkId: -1, //当前处理的作品的id
      eid: -1,  //当前处理的记录的id
      postPage: -1,
      allNum: 0,
    };
  },
  methods: {
    //忽略这个举报的的响应函数
    onIgnoreReport(id) {
      this.eid = id;
      //被忽略的贴子的id
      get({
        url: "/api/adminHandle",
        params: {
          userid: this.userid,
          eid: this.eid,
          result: -1,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 1) {
            Toast("已忽略");
            this.deleteFromList();
          }else{
            Toast(res.data.msg);
          }
        })
        .catch((res) => {});      
    },
    //接受这个圈子申请的响应函数
    onDeleteReport(id) {
      this.eid = id;
      //被删除的贴子的id
      get({
        url: "/api/adminHandle",
        params: {
          userid: this.userid,
          eid: this.eid,
          result: 1,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 1) {
            Toast("删除成功");
            console.log(this.postList)
            this.deleteFromList();
          }else{
            Toast(res.data.msg);
          }
        })
        .catch((res) => {});
      
    },
    //删除列表中相应的记录
    deleteFromList() {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].eid == this.eid)
          this.postList.splice(i, 1);
      }
    },
    //下拉刷新的两个函数
    onLoad() {
        if (this.refreshing) {
          this.postList = [];
          this.postPage = -1;
          this.allNum = 0;
          this.refreshing = false;
        }
        this.postPage += 1;
        get({
          url: "/api/adminGetEvents",
          params: {
            userid: this.userid,
            page: this.postPage,
            type: 1,
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.ok == 1) {
              this.allNum = res.data.max;
              res.data.data.forEach((element) => {
                this.postList.push(element);
              });
              this.loading = false;
            }
            if (this.postList.length >= this.allNum) {
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
  mounted() {
    if (this.$cookies.isKey("admin") == false) {
      Toast("请重新登录");
      this.$router.push("/login");
    } else {
      this.userid = this.$cookies.get("admin");
    }
  },
};
</script>

<style scoped>
/deep/ .van-cell .van-icon {
  color: #459cfc;
}

#postList {
  margin: 0px;
  padding: 0px;
}

.infoButton {
  height: auto;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>