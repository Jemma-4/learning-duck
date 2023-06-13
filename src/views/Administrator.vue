<template>
  <div id="back">
    <!--导航栏-->
    <van-collapse v-model="activeNames">
      <van-collapse-item 
      title="你好, 管理员!" 
      name="1"
      id="title"
      title-style="color:white;font-size:16px;">
        <van-button
        class="back-button"
        @click="getout()">退出登录</van-button>
      </van-collapse-item>
    </van-collapse>
    <!--未处理的圈子申请-->
    <van-cell
      title="未处理的圈子申请"
      icon="smile-comment-o"
      class="titleCell"
      :border="false"
      title-style="color:white"
    />
    <ApplyList />

    <!--未处理的贴子举报-->
    <van-cell title="未处理的贴子举报" icon="envelop-o" class="titleCell" title-style="color:white" />
    <ReportList />
    <!--开场动画-->
    <van-popup v-model="show" id="popup" :close-on-click-overlay="false">
      <van-icon name="play-circle-o" size="150" @click="start" />
      <p class="startWord">您的id: {{uid}}</p>
      <p class="startWord">请开始管理!</p>
    </van-popup>
  </div>
</template>

<script>
import ApplyList from "../components/ApplyList";
import ReportList from "../components/ReportList";
import { Toast } from 'vant';

export default {
  name: "Administrator",
  components: { ReportList, ApplyList },
  data() {
    return {
      show: true,
      uid: 210003, //管理员id
      activeNames: [],
    };
  },
  methods: {
    //开始管理
    start() {
      this.show = false;
    },
    getout(){
      this.$cookies.remove("admin");
      this.$router.push("/login");
    }
  },
  mounted(){
    if(this.$cookies.isKey("admin") == false){
      Toast("请重新登录");
      this.$router.push("/login");
    }else{
      this.uid = this.$cookies.get("admin");
    }
  }
};
</script>

<style scoped>
#back {
  background-color: steelblue;
}

#popup {
  background-color: transparent;
  top: 40%;
  height: auto;
  width: auto;
  padding: 0px;
  text-align: center;
  font-size: 16px;
  color: white;
}

.startWord {
  margin: 0px;
  padding: 0px;
}

.titleCell {
  background-color: #459cfc;
}

.titleCell /deep/ .van-icon {
  color: white;
}

/deep/.van-cell.van-cell--clickable.van-collapse-item__title{
    background-color: #459cfc;
}

/deep/.van-icon.van-icon-arrow.van-cell__right-icon{
    color: white;
}

.back-button{
    border:0px;
    background-color:rgba(0,0,0,0);
    height:20px;
    color:orangered;
}
</style>