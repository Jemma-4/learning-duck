<template>
  <div id="community">
    <van-row class="title">
      <van-col span="3">
        <van-button
          size="large"
          class="back-button"
          :icon="require('../assets/back.png')"
          @click="goBackClick()"
        ></van-button>
      </van-col>
      <van-col span="18">
        <div
          style="font-size:16px;padding-top:15px;padding-bottom:5px;color:black;text-align:center"
        >我加入的圈子</div>
      </van-col>
      <van-col span="3"></van-col>
    </van-row>

    <div class="divider"></div>
    <div class="group-list">
      <div v-for="item in groupList" :key="item.id" class="group-item" @click="goGroupDetail(item.groupId)">
        <!-- 圈子信息栏，头像，名称，日期，关注按钮 -->

        <van-row class="group-info-row" type="flex" justify="start" align="center">
          <van-col span="5">
            <!-- 头像 -->
            <van-image
              :src="item.groupImg"
              fit="cover"
              square
              class="group-info-img"
            ></van-image>
          </van-col>

          <van-col>
            <van-row>
              <div class="group-info-name">{{item.groupName}}</div>
            </van-row>

            <van-row>
              <div class="van-ellipsis">{{item.groupDescribe}}</div>
            </van-row>

            <van-row>
              <van-col>
                <div class="worknums">作品:{{item.worknums}}</div>
              </van-col>

              <van-col>
                <div class="membernums">成员:{{item.membernums}}</div>
              </van-col>
            </van-row>
          </van-col>
        </van-row>

        <div class="divider"></div>
      </div>
    </div>
    <div class="divider"></div>
    <div
      style="font-size:16px;padding-top:10px;padding-bottom:10px;color:rgba(0, 0, 0, 0.45);;text-align:center"
    >没有更多内容了</div>
  </div>
</template>

<script>
import { get } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "community",
  data() {
    return {
      userid: 0,
      groupList: [
        //相关评论列表，点击用户名可跳转用户详情页
        {
          id: 1,
          groupId: 112221,
          groupName: "刘佬的小弟们",
          groupImg: "https://img.yzcdn.cn/vant/cat.jpeg",
          groupDescribe: "这里是ldn大佬的小弟们",
          worknums: 100,
          membernums: 24
        },
        {
          id: 2,
          groupId: 112222,
          groupName: "张佬的小弟们",
          groupImg:
            "https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2300875363,445064071&fm=5",
          groupDescribe: "这里是zyl大佬的小弟们",
          worknums: 120,
          membernums: 18
        },
        {
          id: 3,
          groupId: 112223,
          groupName: "陆佬的小弟们",
          groupImg:
            "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2033478284,1313999709&fm=26&gp=0.jpg",
          groupDescribe: "这里是lzy大佬的小弟们",
          worknums: 666,
          membernums: 88
        },
        {
          id: 4,
          groupId: 112224,
          groupName: "然总的小弟们",
          groupImg:
            "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2545941047,199838096&fm=26&gp=0.jpg",
          groupDescribe: "这里是wr大佬的小弟们",
          worknums: 6666,
          membernums: 888
        },
        {
          id: 5,
          groupId: 112225,
          groupName: "谈菜的爸爸们",
          groupImg:
            "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2903852108,2610574173&fm=26&gp=0.jpg",
          groupDescribe: "这里是tjh小菜鸡的爸爸们",
          worknums: 99,
          membernums: 4
        }
      ] //相关评论列表
    };
  },
  methods: {
    goBackClick() {
      this.$router.go(-1);
    },
    goGroupDetail(val) {
      //跳转到用户详情页
      console.log("跳到圈子 " + val + " 的详情页");
            this.$router.push("/group/" + this.userid + "/" + val);
    }
  },
  mounted() {
    this.userid = this.$cookies.get("userid");
    this.groupList = [];
    get({
      url: "/api/my_community?userid=" + this.userid
    })
      .then(res => {
        console.log("aaa");
        if (res.data.ok == 0) {
          this.groupList = [];
          return;
        }
        res.data.groupList.forEach(element => {
          this.groupList.push(element);
        });
      })
      .catch(res => {
        this.groupList = [];
      });
  }
};
</script>

<style scoped>
.divider {
  background-color: rgba(0, 0, 0, 0.1);
  height: 1px;
  width: 100%;
  bottom: 12px;
  top: 12px;
}

.fans-list {
}
.title {
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: #ffc800;
}

.back-button {
  border: 0px;
  padding-left: 0px;
  padding-bottom: 0px;
  background-color: #ffc800;
}
.group-info-row {
  padding-top: 20px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: 40px;
}

.group-info-name {
  padding-left: 1px;
  height: 20px;
  font-size: 14px;
}

.van-ellipsis {
  padding-left: 20px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.75);
}

.group-info-img {
  border-radius: 6px;
  height: 50px;
  width: 50px;
}

.worknums {
  padding-left: 1px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.membernums {
  padding-left: 15px;
  height: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>