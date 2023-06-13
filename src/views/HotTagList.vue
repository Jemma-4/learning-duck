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
                <div :class="id<3?'hot-rank':'rank'">{{id+1}}</div>
              </van-col>
              <van-col span="16">
                <van-row>
                  <div class="tag-name">{{item.tagname}}</div>
                </van-row>
                <van-row>
                  <div class="tag-num">热议数 {{item.worknums}}</div>
                </van-row>
              </van-col>
              <van-col span="5">
                <div class="tag-state-red" v-if="item.state==0">爆</div>
                <div class="tag-state-orange" v-if="item.state==1">热</div>
                <div class="tag-state-blue" v-if="item.state==2">荐</div>
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
  data() {
    return {
      userId: 1000,
      tagList: [
        // {
        //   tagid: 1,
        //   tagname: "番茄",
        //   state: 0,     // 爆
        //   worknums:10000,
        // },
        // {
        //   tagid: 1,
        //   tagname: "番茄",
        //   state: 1,    // 热
        //   worknums:10000,
        // },
        // {
        //   tagid: 1,
        //   tagname: "番茄",
        //   state: 2,   // 荐
        //   worknums:10000,
        // }
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
          url: "/api/discover",
          params: {
            userid: this.userId,
            page: this.page,
            num: 10, // 每页的条数
            type: 4 // 搜标签
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
  mounted(){
    this.userId = this.$cookies.get("userid");
  }
};
</script>

<style scoped>
.tag-row {
  height: 60px;
}
.hot-rank {
  font-size: 25px;
  font-style: italic;
  height: 60px;
  line-height: 60px;
  padding-left: 35px;
  color: orangered;
}

.rank {
  font-size: 20px;
  height: 60px;
  line-height: 60px;
  padding-left: 35px;
  color: orange;
}

.tag-name {
  font-size: 16px;
  padding-left: 35px;
  height: 30px;
  line-height: 30px;
}

.tag-state-red {
  width: 20px;
  height: 20px;
  background-color: orangered;
  font-size: 12px;
  color: white;
  text-align: center;
  line-height: 20px;
  margin-top: 20px;
  border-radius: 4px;
}

.tag-state-orange {
  width: 20px;
  height: 20px;
  background-color: orange;
  font-size: 12px;
  color: white;
  text-align: center;
  line-height: 20px;
  margin-top: 20px;
  border-radius: 4px;
}

.tag-state-blue {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background-color: #459cfc;
  font-size: 12px;
  color: white;
  text-align: center;
  margin-top: 20px;
  border-radius: 4px;
}

.tag-num{
  font-size: 12px;
  padding-left: 35px;
  height: 30px;
  line-height: 30px;
  color:rgba(0,0,0,0.25);
}
</style>