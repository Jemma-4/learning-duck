<template>
  <div id="MyWallet">
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
        >我的钱包</div>
      </van-col>
      <van-col span="3"></van-col>
    </van-row>
    <div class="divider"></div>
    <div class="power-pannel">
      <van-row class="power-row">
        <van-col span="1">
          <van-button color="#ffc800" square disabled type="primary" class="mypower"></van-button>
        </van-col>

        <van-col span="10">
          <div
            style="font-size:20px;padding-top:10px;padding-bottom:10px;color:black;text-align: left"
          >我的鸭力：{{power}}</div>
        </van-col>

        <van-col span="1">
          <van-button color="#ffc800" square disabled type="primary" class="myeggs"></van-button>
        </van-col>

        <van-col span="10">
          <div
            style="font-size:20px;padding-top:10px;padding-bottom:10px;color:black;text-align: left"
          >我的鸭蛋：{{eggs}}</div>
        </van-col>
      </van-row>
    </div>
    <div class="divider"></div>
    <div class="explation-list">
      <div v-for="item in explationList" :key="item.id" class="ex-item">
        <van-row class="ex-row" type="flex" justify="start" align="center">
          <van-col span="1">
            <van-button color="#ffc800" square disabled type="primary" class="ex-button"></van-button>
          </van-col>

          <van-col span="17">
            <van-row>
              <div class="ex-title">{{item.title}}?</div>
            </van-row>
          </van-col>
        </van-row>

        <van-row>
          <div class="ex-content">{{item.content}}</div>
        </van-row>
        <div class="divider"></div>
      </div>
    </div>
  </div>
</template>




<script>
import {get} from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "Mywallet",
  data() {
    return {
      userid:1,
      power: 77,
      eggs: 59,
      explationList: [
        //相关评论列表，点击用户名可跳转用户详情页
        {
          id: 1,
          title: "什么是鸭力",
          content:
            "只有拥有足够的鸭力，您才能体验更丰富的社区功能，比如为他人点赞、或自己发布作品。"
        },
        {
          id: 2,
          title: "如何获取鸭力",
          content:
            "每位用户初始的鸭力上限为100点，随着用户累计获得的鸭蛋数量的增加，鸭力上限也会提高，最高可以提高到300点。\n" +
            "能量回复速度，专注一个整小时给5点鸭力。也可以用50个鸭蛋换取1点鸭力。"
        },
        {
          id: 3,
          title: "鸭力的使用规则",
          content:
            "发布帖子，消耗5点鸭力；点赞或转发作品，会消耗3点鸭力；若拥有的鸭力不足，则无法进行对应的操作。"
        },
        {
          id: 4,
          title: "学习鸭为什么要设置鸭力",
          content:
            "设置鸭力是为了避免出现传统互联网社区中水军刷帖，跟风获利等不利于社区健康发展的行为。"
        },
        {
          id: 5,
          title: "什么是鸭蛋",
          content:
            "鸭蛋是平台提供的虚拟货币，当用户发帖每收到一个点赞时，该用户便可以获得1个鸭蛋。鸭蛋可以用于购买鸭力、购买付费帖子。"
        }
      ]
    };
  },
  methods:{
    goBackClick(){
      this.$router.go(-1);
    },
  },
  mounted(){
    this.userid = this.$cookies.get("userid");
    this.power = this.$cookies.get("power");
    this.eggs = this.$cookies.get("credit");
    get({
      url:"/api/my_wallet?userid="+this.userid
    })
    .then(res=>{
      console.log('aaa');
      if(res.data.ok==0){
        this.power=100;
        this.egg=0;
        return;
      }
      this.eggs=res.data.eggs;
      this.power=res.data.power;
    })
    .catch(res=>{
      this.eggs=0;
      this.power=100;
    })
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

.ex-row {
  padding-top: 20px;
  padding-bottom: 10px;
  padding-right: 15px;
  height: 40px;
}

.ex-title {
  height: 20px;
  font-size: 18px;
  padding-bottom: 12px;
  font-family: "bold";
}

.ex-button {
  color: #ffc800;
  height: 40px;
  width: 10px;
}

.mypower {
  color: #ffc800;
  height: 40px;
  width: 150px;
}

.myeggs {
  color: #ffc800;
  height: 40px;
  width: 150px;
}

.ex-content {
  font-size: 14px;
  font-family: "微软雅黑";
  padding-left: 15px;
  padding-top: 9px;
  padding-bottom: 9px;
  color: rgba(0, 0, 0, 0.75);
}
</style>