<template>
  <div id="Mine">
    <div class="topblock">
      <van-row>
        <van-col span="4">
          <van-button
            class="settingbutton"
            round
            :icon="require('../assets/setting.png')"
            @click="tab_btn('setting')"
          ></van-button>
        </van-col>
        <van-col offset="16" span="4">
          <div class="energy-col">
            <van-image class="energy-icon" :src="require('../assets/state-'+energyLevel+'.png')" />
            <div>{{this.energy}}/100</div>
          </div>
        </van-col>
      </van-row>
    </div>
    <div
      class="divider"
      fit="none"
      style="background-color: rgba(0, 0, 0, 0.1);  height: 1px;  width: 100%;"
    ></div>
    <div class="user">
      <van-row>
        <van-col span="5">
          <div class="headimage" style="width: 70px;  height: 70px;">
            <van-image round fit="cover" class="head-img" :src="this.imgurl" />
          </div>
        </van-col>
        <van-col span="18" offset="1">
          <div class="userinfo">
            <div class="username">{{this.username}}</div>
            <div class="userid">鸭鸭号：{{this.userid}}</div>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="btnGroup">
      <van-row type="flex" justify="space-around">
        <van-col span="3" @click="tab_btn('myworks')">
          <div class="btn_num">{{this.worknum}}</div>
          <div class="btn_name">作品</div>
        </van-col>
        <van-col span="3" @click="tab_btn('follow')">
          <div class="btn_num">{{this.care}}</div>
          <div class="btn_name">关注</div>
        </van-col>
        <van-col span="3" @click="tab_btn('fans')">
          <div class="btn_num">{{this.fans}}</div>
          <div class="btn_name">粉丝</div>
        </van-col>
        <van-col span="3" @click="tab_btn('likeworks')">
          <div class="btn_num">{{this.thumbup}}</div>
          <div class="btn_name">点赞</div>
        </van-col>
      </van-row>
    </div>
    <div class="cellGroup">
      <van-cell-group title=" ">
        <van-cell
          title="我的钱包"
          value="鸭蛋、鸭力"
          :icon="require('../assets/wallet.png')"
          @click="tab_btn('wallet')"
        />
        <van-cell
          title="我的消息"
          :icon="require('../assets/message.png')"
          @click="tab_btn('message')"
        />
        <van-cell
          title="我的圈子"
          :value="'已加入'+this.groupnum+'个圈子'"
          :icon="require('../assets/group-mine.png')"
          @click="tab_btn('mygroup')"
        />
        <van-cell
          title="查看我的学习情况"
          value="内容"
          :icon="require('../assets/study-mine.png')"
          @click="goLearningDeatil()"
        />
      </van-cell-group>
      <van-cell-group title=" ">
        <van-cell
          title="产品亮点"
          :icon="require('../assets/idea.png')"
          @click="tab_btn('learningdetail')"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { get } from "../router/request.js";
export default {
  name: "Mine",
  data() {
    return {
      username: "谈x陆佬",
      userid: 0,
      imgurl: "https://img.yzcdn.cn/vant/cat.jpeg",
      worknum: 5,
      care: 12,
      fans: 1,
      thumbup: 100,
      groupnum: 8, 
      energy: 1,
    };
  },
  computed: {
    energyLevel(){
      if(this.energy==0)
      {
        return 0;
      }else if(this.energy==100){
        return 10;
      }else{
        return Math.floor(this.energy/10)+1
      }
    }
  },
  methods: {
    tab_btn(val) {
      console.log(val);
      this.$router.push("/" + val);
    },
    goLearningDeatil(){
      this.$router.push("/learningdetail/" + this.userid);
    },
    // 加载用户信息
    loadUserInfo() {
      if (this.$cookies.isKey("userid") == false) {
        return;
      }
      this.userid = this.$cookies.get("userid");
      get({
        url: "/api/getUserInfo",
        params: {
          userid: this.userid,
          myid: this.userid
        }
      })
        .then(res => {
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 600
            });
          } else {
            this.$cookies.set("userid", res.data.userid);
            this.$cookies.set("username", res.data.username);
            this.$cookies.set("sex", res.data.sex);
            this.$cookies.set("userheadimg", res.data.headImage);
            this.$cookies.set("inRoom", res.data.inRoom);
            this.$cookies.set("studytime", res.data.studytime);
            if (res.data.inRoom) {
              this.$cookies.set("roomname", res.data.roomname);
              this.$cookies.set("roomid", res.data.roomid);
            }
            this.$cookies.set("workNum", res.data.workNum);
            this.$cookies.set("careNum", res.data.careNum);
            this.$cookies.set("fansNum", res.data.fansNum);
            this.$cookies.set("groupNum", res.data.groupNum);
            this.$cookies.set("likeNum", res.data.thumbsup);
            this.$cookies.set("credit", res.data.credit);
            this.$cookies.set("power", res.data.power);
            this.energy=this.$cookies.get("power");
            this.username = this.$cookies.get("username");
            this.imgurl = this.$cookies.get("userheadimg");
            this.worknum = this.$cookies.get("workNum");
            this.care = this.$cookies.get("careNum");
            this.fans = this.$cookies.get("fansNum");
            this.groupnum = this.$cookies.get("groupNum");
            this.thumbup = this.$cookies.get("likeNum");
          }
        })
        .catch(res => {
          Toast("数据获取失败");
        });
    }
  },
  mounted() {
    this.userid = this.$cookies.get("userid");
    this.loadUserInfo();
    
  }
};
</script>

<style scoped>
.topblock {
  padding-top: 10px;
  padding-left: 10px;
  height: 40px;
  background-color: #ffc800;
}

.settingbutton {
  width: 20px;
  height: 20px;
  border: none;
  bottom: 5px;
  background-color: #ffc800;
}

.van-icon__image {
  width: 20px;
  height: 20px;
}

.van-image__img {
  width: 60px;
  height: 60px;
}

.user {
  padding-top: 20px;
  padding-left: 20px;
  height: 70px;
}

.userinfo {
  padding-top: 5px;
  padding-left: 0px;
}

.username {
  font-size: 18px;
  font-weight: bold;
}

.userid {
  padding-top: 5px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.3);
}

.btnGroup {
  padding-top: 11px;
  text-align: center;
}

.btn_name {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.3);
}

.btn_num {
  font-size: 20px;
}

.cellGroup {
  padding-top: 25px;
}

.van-cell__title {
  padding-left: 6px;
  font-size: 16px;
  font-weight: bold;
}
.head-img {
  height: 60px;
  width: 60px;
}

.energy-col{
  width:40px;
  height:20px;
  font-size: 10px;
  color:white;
  padding-top:7px;
  padding-left:10px;
}
</style>