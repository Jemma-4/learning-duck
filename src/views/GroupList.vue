<template>
  <div id="group-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        success-text="刷新成功"
        @load="onLoad"
      >
        <div class="group-list">
          <div v-for="(item,id) in groupList" :key="id" @click="choseThis(item.groupid)">
            <van-row class="user-info-row" type="flex" justify="start" align="center">
              <van-col span="4">
                <van-image :src="item.backgroundimage" fit="cover" class="user-info-img"></van-image>
              </van-col>
              <van-col span="17">
                <van-row>
                  <div class="user-info-name">{{item.groupname}}</div>
                </van-row>
                <van-row>
                  <div class="user-info-des">{{item.briefDescription}}</div>
                </van-row>
                <van-row>
                  <van-col span="6">
                    <div class="user-info-num">作品{{item.groupworknum}}</div>
                  </van-col>
                  <van-col span="8">
                    <div class="user-info-num">粉丝{{item.membernum}}</div>
                  </van-col>
                </van-row>
              </van-col>
              <van-col span="2">
                <van-button
                  v-show="!item.ismember"
                  class="user-follow-button"
                  :icon="require('../assets/toin.png')"
                  @click.stop="followClick(item)"
                ></van-button>
                <van-button
                  v-show="item.ismember"
                  class="user-followed-button"
                  :icon="require('../assets/in.png')"
                  @click.stop="followClick(item)"
                ></van-button>
              </van-col>
            </van-row>
            <div style="height:1px;background-color:rgba(0,0,0,0.05);" />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { get, post } from "../router/request.js";
import { Toast } from "vant";

export default {
  name: "GroupList",
  props: {
    //对接
    // userId: 0,
    url: "", // search discover
    type: 0, //  3       3
    para: "" // keyword
  },
  data() {
    return {
      userId: 0,
      groupList: [
        // {
        //   backgroundimage: "https://img.yzcdn.cn/vant/cat.jpeg",
        //   groupname: "妮妮鸭",
        //   groupid: 1,
        //   briefDescription: "描述就是这样，大概10个字...",
        //   groupworknum: 10,
        //   membernum: 300,
        //   ismember: false,
        // },
      ],
      loading: false,
      finished: false,
      refreshing: false,
      page: 0,
      maxNum: 0
    };
  },
  methods: {
    choseThis(val) {
      console.log("跳转到圈子详情");
      this.$router.push("/group/" + this.userId + "/" + val);
    },
    followClick(item) {
      //加入圈子
      if (item.ismember == false) {
        get({
          url: "/api/joinGroup",
          params: {
            userid: this.userId,
            groupid: item.groupid
          }
        })
          .then(res => {
            if (res.data.ok == 1) {
              Toast("加入成功");
              item.membernum++;
              item.ismember = true;
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(res => {
            Toast("加载失败");
          });
      } else {
        // 退出圈子
        get({
          url: "/api/exitGroup",
          params: {
            userid: this.userId,
            groupid: item.groupid
          }
        })
          .then(res => {
            if (res.data.ok == 1) {
              Toast("退出成功");
              item.ismember = false;
              item.membernum--;
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(res => {
            Toast("加载失败");
          });
      }
    },

    //下拉刷新列表的两个响应函数
    onLoad() {
      //   //对接：列表拉取
      if (this.refreshing) {
        this.groupList = [];
        this.page = 0;
        this.refreshing = false;
      }
      this.page += 1;
      get({
        url: "/api/" + this.url,
        params: {
          userid: this.userId,
          keyword: this.para,
          type: this.type,
          page: this.page,
          num: 8 // 每页的条数
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 1) {
            this.maxNum = res.data.max;
            // 这里拿数据
            res.data.groupList.forEach(element => {
              this.groupList.push(element);
            });
            this.loading = false;
          }
          if (this.groupList.length >= this.maxNum) {
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
      this.groupList = [];
      this.onRefresh();

      // console.log(this.userList);
    }
  }
};
</script>

<style scoped>
.user-info-img {
  margin-top: 10px;
  height: 60px;
  width: 60px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.van-image >>> .van-image__img {
  border-radius: 4px;
}

.user-info-name {
  padding-left: 30px;
  height: 20px;
  font-size: 14px;
  margin-top: 10px;
  color: #459cfc;
}

.user-follow-button {
  border: 0px;
  background-color: #ffc800;
  height: 30px;
  width: 30px;
  border-radius: 5px;
}

.user-followed-button {
  border: 0px;
  background-color: rgba(0, 0, 0, 0.25);
  height: 30px;
  width: 30px;
  border-radius: 5px;
}

.user-info-num {
  padding-left: 30px;
  height: 20px;
  line-height: 20px;
  padding-bottom: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.25);
  width: 100px;
}

.user-info-des {
  padding-left: 30px;
  height: 20px;
  font-size: 14px;
}
</style>