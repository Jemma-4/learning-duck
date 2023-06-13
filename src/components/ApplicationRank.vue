<template>
  <div id="applicationRank">
    <van-pull-refresh 
    v-model="refreshing"
    @refresh="onRefresh">
      <van-list 
      v-model="loading" 
      :finished="finished" 
      finished-text="没有更多了" 
      @load="onLoad">
        <van-cell 
        v-for="item in userList" 
        :key="item.userid" 
        class="userListItem">
          <van-row gutter="10">
            <van-col span="6">
              <van-image 
              fit="cover" 
              round radius="5px" 
              :src="item.headimage" />
            </van-col>
            <van-col span="6" id="nameBar">
              {{item.username}}
            </van-col>
            <van-col span="12" id="studyTimeWord">学习时长{{item.studytime}}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { get } from "../router/request.js";
export default {
  name: "ApplicationRank",
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: true,
      //userList:[],
      userList: [
      ],
      rankPage: -1,
      maxNum: 0,
    };
  },
  methods: {
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
          url: "/api/getStudyRank",
          params: {
            page: this.rankPage,
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.ok == 1) {
              this.maxNum = res.data.max;
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
      console.log(this.finished);
      console.log(this.userList.length);
      console.log(this.maxNum);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      console.log(this.refreshing);
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
};

</script>

<style scoped>
#applicationRank {
  width: 340px;
  height: 600px;
  overflow: scroll;
  background-color: rgba(0, 0, 0, 0.2);
}

#nameBar {
  font-size: 16px;
}

#studyTimeWord {
  color: #39a9ed;
  font-size: 14px;
}

.userListItem {
  margin: 2px;
  background-color: rgba(255, 255, 255, 0.75);
}
</style>

