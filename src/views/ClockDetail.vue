<template>
  <div id="clock-detail">
    <!-- 背景图，每次刷新背景刷新 -->
    <audio id="audio"></audio>
    <div
      class="background-img"
      :style="{backgroundImage:'url(' + require('../assets/background/'+random+'.png') + ')'}"
    >
      <!-- 顶栏，包裹返回按钮  -->
      <van-sticky :offset-top="20" class="top">
        <van-row class="top-tochose" type="flex" justify="start" align="bottom">
          <!-- 返回按钮，返回上一页，这个理应和停止按钮接一个函数 -->
          <van-col span="6">
            <van-button
              size="large"
              class="back-button"
              :icon="require('../assets/back-white.png')"
              @click="goBackClick()"
            ></van-button>
          </van-col>
        </van-row>
      </van-sticky>

      <!-- 装饰文字框1 -->
      <div class="decorate-label1">“</div>

      <!-- 装饰文字框2 -->
      <div class="decorate-label2">{{this.aoligei}}</div>

      <!-- 专注计时时，展示的环形进度条 -->
      <van-circle
        v-model="currentRate1"
        v-show="isFocus"
        :rate="rate1"
        :clockwise="true"
        size="60%"
        layer-color="rgba(255,255,255,0)"
        color="rgba(255,255,255,1)"
        class="detail-process"
        :stroke-width="20"
      />

      <!-- 休息计时时，展示的环形进度条 -->
      <van-circle
        v-model="currentRate2"
        v-show="!isFocus"
        :rate="rate2"
        :clockwise="true"
        size="60%"
        layer-color="rgba(255,255,255,0)"
        color="rgba(255,255,255,1)"
        class="detail-process"
        :stroke-width="20"
      />

      <!-- 倒计时上方名字显示栏 -->
      <div class="info-title-label">{{this.title}}</div>

      <!-- 倒计时渲染栏 -->
      <div class="info-time-row">
        <van-count-down :time="time" @finish="handleFinish()" ref="countDown">
          <template v-slot="timeData">
            <span>{{ timeData.hours }}</span>
            <span>:</span>
            <span>{{ timeData.minutes }}</span>
            <span>:</span>
            <span>{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
      <!-- 倒计时下方，状态显示栏，此为专注状态 -->
      <div v-show="isFocus" class="info-state-label">专注中</div>

      <!-- 倒计时下方，状态显示栏，此为休息状态 -->
      <div v-show="!isFocus" class="info-state-label">休息中</div>
    </div>

    <!-- 功能栏，开启长亮按钮，选bgm按钮，终止按钮 -->
    <van-row class="function-row" type="flex" justify="center" align="top">
      <!-- 常量按钮，理应连接安卓原生 -->
      <van-col span="8">
        <van-button
          size="large"
          class="function-button"
          :icon="islight==true?require('../assets/light-active.png'):require('../assets/light.png')"
          @click="lightClick()"
        ></van-button>
      </van-col>
      <van-col span="8">
        <van-button
          size="large"
          class="function-button"
          :icon="require('../assets/music-active.png')"
          @click="musicClick()"
          v-if="play"
        ></van-button>
        <van-button
          size="large"
          class="function-button"
          :icon="require('../assets/music.png')"
          @click="musicClick()"
          v-if="!play"
        ></van-button>
      </van-col>
      <van-col span="8">
        <van-button
          size="large"
          class="function-button"
          :icon="require('../assets/stop-active.png')"
          @click="goBackClick()"
        ></van-button>
      </van-col>
    </van-row>

    <!-- 失败原因收集弹窗 -->
    <van-popup v-model="focusStop" duration="0.3" round :overlay="false" class="stop-popup">
      <div class="fail-reason-remind">
        <div class="fail-reason-title-label">小黑屋惩罚</div>
        <div class="fail-reason-describe-label">您可以输入本次放弃的理由，以供后续分析原因，提高效率。</div>
        <van-field
          v-model="failReason"
          :border="true"
          input-align="center"
          :center="true"
          placeholder="请输入专注失败原因"
          class="fail-reason-field"
        />
        <van-row type="flex" justify="center" align="center">
          <van-col>
            <van-button class="popup-button" @click="failConfirm()">确认</van-button>
          </van-col>
        </van-row>
      </div>
    </van-popup>

    <!-- 休息时间终止弹窗 -->
    <van-popup v-model="relaxStop" duration="0.3" round :overlay="false" class="stop-popup">
      <div class="relax-stop-remind">
        <div class="relax-title-label">提示</div>
        <div class="relax-question-label">确定要跳过休息时间吗?</div>
        <div class="relax-describe-label">您可以在休息时间放下手机远眺放松，在番茄工作法中，休息也是很重要的一个环节哦！</div>
        <van-row type="flex" justify="center" align="center">
          <van-col span="12">
            <van-button class="popup-button" @click="relaxConfirm()">确认</van-button>
          </van-col>
          <van-col span="12">
            <van-button class="popup-button" @click="relaxCancel()">取消</van-button>
          </van-col>
        </van-row>
      </div>
    </van-popup>

    <!-- 非小黑屋友善提醒 -->
    <van-popup
      v-model="noBlackHouseFocusStop"
      duration="0.3"
      round
      :overlay="false"
      class="stop-popup"
    >
      <div class="relax-stop-remind">
        <div class="black-house-title-label">提示</div>
        <div class="black-house-question-label">未开启小黑屋功能</div>
        <div class="black-house-describe-label">是否确认放弃本次计时?</div>
        <van-row type="flex" justify="center" align="center">
          <van-col span="12">
            <van-button class="popup-button" @click="relaxConfirm()">确认</van-button>
          </van-col>
          <van-col span="12">
            <van-button class="popup-button" @click="blackHouseCancel()">取消</van-button>
          </van-col>
        </van-row>
      </div>
    </van-popup>

    <!-- 选bgm弹窗 -->
    <van-popup
      v-model="choseMusicShow"
      duration="0.3"
      round
      closeable
      :overlay="false"
      class="grid-popup"
    >
      <van-grid :column-num="3" :border="false">
        <van-grid-item
          v-for="item in musicList"
          :key="item.id"
          :text="item.name"
          @click="changeMusic(item.id)"
        />
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import { get, post } from "../router/request.js";
export default {
  name: "ClockDetail",
  data() {
    return {
      backString: " < 返回", //页面
      currentRate1: 0, //页面，用于专注进度条
      currentRate2: 0, //页面，用于休息进度条
      hasDone: 0, //当前完成情况，页面控制，进度条公用
      current: 0, //当前处在第几个时间断，偶数为专注
      aoligei:
        "这句话其实就是个装饰品，为了测试我会让它长一点，长亿点，再长一点。", //页面
      islight: true, //是否开启屏幕常亮
      relaxStop: false, //控制休息时间停止弹窗
      focusStop: false, //控制专注时间停止弹窗
      choseMusicShow: false, //选背景音乐弹窗
      noBlackHouseFocusStop: false, //非小黑屋非法终止友善提示
      musicSrc: "../static/audios/1.mp3",
      musicList: [
        { id: 1, name: "高清雨声HD", path: "../static/audios/1.mp3" },
        { id: 2, name: "河边篝火HD", path: "../static/audios/2.mp3" },
        { id: 3, name: "高清风声HD", path: "../static/audios/3.mp3" },
        { id: 4, name: "阳光沙滩HD", path: "../static/audios/4.mp3" },
        { id: 5, name: "春日鸟鸣HD", path: "../static/audios/5.mp3" },
        { id: 6, name: "时钟滴答HD", path: "../static/audios/6.mp3" },
        { id: 7, name: "静谧钢琴HD", path: "../static/audios/7.mp3" },
        { id: 8, name: "课后教室HD", path: "../static/audios/8.mp3" },
        { id: 9, name: "静心沉思HD", path: "../static/audios/9.mp3" },
        { id: 10, name: "悠闲咖啡HD", path: "../static/audios/10.mp3" },
        { id: 11, name: "热带雨林HD", path: "../static/audios/11.mp3" },
        { id: 12, name: "小河流水HD", path: "../static/audios/12.mp3" }
      ],

      title: "番茄钟样例", //番茄钟
      userId: 0, //番茄钟，记录
      time: 0,
      focusTime: 0.2, //番茄钟
      relaxTime: 0.1, //番茄钟
      isCirculate: true, //番茄钟
      isBlackHouse: true, //番茄钟
      id: 10001, //番茄钟
      isFocus: true, //记录
      startTime: 0, //记录
      runTime: 0, //记录
      isCompleted: false, //记录
      failReason: "", //记录
      type: 0, //0番茄钟，1长期计划
      play: false
    };
  },
  computed: {
    random() {
      //计算属性，用于随机背景图
      let num = Math.floor(Math.random() * (7 - 1) + 1);
      return num.toString();
    },
    rate1: {
      //专注进度条
      get() {
        if (this.focusTime == 0) {
          return 0;
        } else {
          return 100 - (this.hasDone * 100) / (this.focusTime * 60);
        }
      },
      set(val) {
        return val;
      }
    },
    rate2: {
      //休息进度条
      get() {
        if (this.focusTime == 0) {
          return 0;
        } else {
          return 100 - (this.hasDone * 100) / (this.relaxTime * 60);
        }
      },
      set(val) {
        return val;
      }
    },
    currentTime: {
      get() {
        return this.focusTime;
      },
      set(val) {
        this.time = val * 60 * 1000;
      }
    }
  },
  methods: {
    //返回按钮，与停止按钮
    goBackClick() {
      if (this.isBlackHouse) {
        if (this.isFocus) {
          this.focusStop = true;
        } else {
          this.relaxStop = true;
        }
      } else {
        if (this.isFocus) {
          this.noBlackHouseFocusStop = true;
        } else {
          this.relaxStop = true;
        }
      }
    },

    //非循环自动跳出，休息时间终止，非小黑屋专注时间终止//上传
    relaxConfirm() {
      if (this.noBlackHouseFocusStop) {
        let now = parseInt(new Date().getTime() / 1000);
        this.runTime =
          now - this.startTime - (this.current / 2) * this.relaxTime;
        this.runTime = parseInt(this.runTime / 60);
      } else {
        this.runTime = this.focusTime;
      }
      this.isCompleted = true;
      this.failReason = "";
      this.updateRecord();
      let state = true;
      //let state=this.updateRecord();
      if (state) {
        Toast(this.title + "完成！");
        this.$router.go(-1);
      } else {
        Toast("记录上传失败");
      }
    },

    //休息时间取消终止
    relaxCancel() {
      this.relaxStop = false;
    },

    //友善提示取消
    blackHouseCancel() {
      this.noBlackHouseFocusStop = false;
    },

    //失败原因收集确认//上传
    failConfirm() {
      let now = parseInt(new Date().getTime() / 1000);
      this.runTime = now - this.startTime - (this.current / 2) * this.relaxTime;
      this.runTime = parseInt(this.runTime / 60);
      this.isCompleted = false;
      this.updateRecord();
      let state = true;
      //let state=this.updateRecord();
      if (state) {
        Toast(this.title + "失败！");
        this.$router.go(-1);
      } else {
        Toast("记录上传失败");
      }
      //上传本次记录
      this.failReason = "";
    },

    //点击是否常亮按钮
    lightClick() {
      this.isLight = this.isLight == true ? false : true;
    },

    //点击跳出选取bgm弹窗
    musicClick() {
      if (this.play) {
        let buttonAudio = document.getElementById("audio");
        buttonAudio.setAttribute("src", require("../static/audios/1.mp3"));
        buttonAudio.setAttribute("loop", "loop");
        //重复播放
        buttonAudio.pause();
        this.play = false;
      } else {
        this.choseMusicShow = true;
        let buttonAudio = document.getElementById("audio");
        buttonAudio.setAttribute("src", require("../static/audios/1.mp3"));
        buttonAudio.setAttribute("loop", "loop");
        //重复播放
        buttonAudio.play();
        this.play = true;
      }
    },

    //点击更换bgm
    changeMusic(val) {
      console.log(val);
      this.choseMusicShow = false;
      let buttonAudio = document.getElementById("audio");
      buttonAudio.setAttribute(
        "src",
        require("../static/audios/" + val + ".mp3")
      );
      buttonAudio.setAttribute("loop", "loop");
      //重复播放
      buttonAudio.play();
      Toast("背景音乐更换成功");
    },

    //计时结束时的调用，控制倒计时切换，与循环计时有关
    handleFinish() {
      this.hasDone = 1;
      if (this.isCirculate) {
        if (this.isFocus) {
          this.current++;
          this.currentTime = this.relaxTime;
          this.$refs.countDown.reset();
          clearInterval(this.timer);
          this.refreshClock();
        } else {
          this.current++;
          this.currentTime = this.focusTime;
          this.$refs.countDown.reset();
          clearInterval(this.timer);
          this.refreshClock();
        }
      } else {
        if (this.isFocus) {
          this.current++;
          this.currentTime = this.relaxTime;
          this.$refs.countDown.reset();
          clearInterval(this.timer);
          this.refreshClock();
        } else {
          this.relaxConfirm();
        }
      }
    },
    updateRecord() {
      //对接：上传记录
      get({
        url: "/api/createStudyRecord",
        params: {
          userid: this.userId,
          planid: this.id,
          starttime: this.startTime,
          runtime: this.runTime,
          failreason: this.failReason,
          target: this.title,
          iscompleted: this.isCompleted ? 1 : 0,
          type: this.type
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.title = res.data.title;
            this.focusTime = res.data.focustime;
            this.relaxTime = res.data.relaxtime;
            this.isCirculate = Boolean(res.data.circulate);
            this.isBlackHouse = Boolean(res.data.blackhouse);
            this.type = res.data.type;
            this.time = this.focusTime * 60 * 1000;
            this.hasDone++;
            this.isFocus = true;
            this.refreshClock();
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(res => {
          Toast("数据加载失败");
        });

      //还有个记录id
      //该函数有一个返回值 为写记录是否成功
    },

    //程序内部倒计时刷新，使与界面倒计时组件同步
    refreshClock() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.isFocus) {
          if (this.hasDone < this.focusTime * 60) this.hasDone++;
          let num = 100 - (this.hasDone * 100) / (this.focusTime / 1000);
          this.rate1 = num;
        } else {
          if (this.hasDone < this.relaxTime * 60) this.hasDone++;
          let num = 100 - (this.hasDone * 100) / (this.relaxTime / 1000);
          this.rate2 = num;
        }
      }, 1000);
    }
  },
  watch: {
    //监视属性，hasDone由内部计时器控制，一旦变化，将变化以rate反应到界面上
    hasDone: {
      handler: function(val, oldval) {
        if (this.isFocus) {
          this.currentRate1 = this.focusTime * 60 * 1000 - this.hasDone * 1000;
        } else {
          this.currentRate2 = this.focusTime * 60 * 1000 - this.hasDone * 1000;
        }
      }
    },
    //监视属性，一旦current当前轮次发生变化就改变专注/休息状态
    current: {
      handler: function(val, oldval) {
        if (val % 2 == 0) {
          this.isFocus = true;
        } else {
          this.isFocus = false;
        }
      }
    }
  },

  //初始化界面定时器和内部定时器
  mounted: function() {
    //开始播放

    // 需要在一开始调用一下方法，否则在开始的30s是没有数据的

    this.userId = this.$cookies.get("userid");
    //对接：根据id获取该次番茄钟详细设置
    this.id = this.$route.params.clockId.split("-")[1]; //具体id
    let type = this.$route.params.clockId.split("-")[0]; //类型

    get({
      url: "/api/getClockDetail",
      params: {
        userid: this.userId,
        clockid: this.id,
        type: type
      }
    })
      .then(res => {
        if (res.data.ok == 1) {
          this.title = res.data.title;
          this.focusTime = res.data.focustime;
          this.relaxTime = res.data.relaxtime;
          this.isCirculate = Boolean(res.data.circulate);
          this.isBlackHouse = Boolean(res.data.blackhouse);
          this.type = res.data.type;
          this.time = this.focusTime * 60 * 1000;
          this.hasDone++;
          this.isFocus = true;
          this.current = 0;
          this.refreshClock();
          this.startTime = parseInt(new Date().getTime() / 1000); //时间戳精确到毫秒
        } else {
          Toast(res.data.msg);
        }
      })
      .catch(res => {
        Toast("数据加载失败");
      });

    //this.startTime=new Date() 日期形式
    //this.startTime=new Date().getTime() 时间戳精确到毫秒
  },
  destroyed: function() {
    clearInterval(this.timer);
  }
};
</script>

<style scoped>
#clock-detail {
  height: 100%;
  width: 375px;
}

.background-img {
  width: 375px;
  height: 100%;
  z-index: -1;
  background-size: cover;
}

.back-button {
  border: 0px;
  padding-left: 0px;
  padding-bottom: 10px;
  background-color: rgba(0, 0, 0, 0);
  width: 57px;
}

.detail-process {
  position: absolute;
  color: white;
  top: 20%;
  left: 20%;
}

.van-circle >>> .van-circle__text {
  color: white;
  font-size: 20px;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}

.decorate-label1 {
  padding-top: 25px;
  padding-left: 20px;
  padding-bottom: 0px;
  color: white;
  font-size: 50px;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}

.decorate-label2 {
  z-index: -1;
  padding-left: 35px;
  padding-right: 20px;
  padding-bottom: -25px;
  color: white;
  font-size: 20px;
  height: 90px;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}

.info-title-label {
  top: 42%;
  position: absolute;
  color: white;
  width: 375px;
  font-size: 16px;
  text-align: center;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}

.van-count-down {
  position: absolute;
  color: white;
  font-size: 35px;
  width: 375px;
  text-align: center;
  top: 49%;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}

.info-state-label {
  top: 55%;
  position: absolute;
  color: white;
  font-size: 16px;
  width: 375px;
  text-align: center;
  text-shadow: 5px 2px 6px rgba(0, 0, 0, 0.25);
}

.function-row {
  position: absolute;
  width: 375px;
  height: 40%;
  bottom: 100px;
  top: 60%;
  border: 0px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}

.function-button {
  border: 0px;
  top: 150px;
  background-color: rgba(0, 0, 0, 0);
}

.van-icon__image {
  width: 30px;
  height: 30px;
}

.stop-popup {
  background-color: rgba(245, 245, 245, 0.9);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
}

.relax-stop-remind {
  height: 160px;
  width: 270px;
  background-color: rgba(245, 245, 245, 0.9);
}

.relax-title-label {
  padding-top: 16px;
  font-size: 20px;
  width: 270px;
  height: 20px;
  font-weight: 550;
  text-align: center;
}

.relax-question-label {
  padding-top: 10px;
  font-size: 12px;
  width: 270px;
  text-align: center;
}

.relax-describe-label {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 12px;
  width: 240px;
  text-align: center;
}

.black-house-title-label {
  padding-top: 16px;
  font-size: 20px;
  width: 270px;
  height: 20px;
  font-weight: 550;
  text-align: center;
}

.black-house-question-label {
  padding-top: 30px;
  font-size: 12px;
  width: 270px;
  text-align: center;
}

.black-house-describe-label {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 6px;
  padding-bottom: 5px;
  font-size: 12px;
  width: 240px;
  text-align: center;
}

.fail-reason-remind {
  width: 270px;
  background-color: rgba(245, 245, 245, 0.9);
}

.fail-reason-title-label {
  padding-top: 16px;
  font-size: 20px;
  width: 270px;
  height: 20px;
  font-weight: 550;
  text-align: center;
}

.fail-reason-describe-label {
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 15px;
  padding-bottom: 5px;
  font-size: 12px;
  width: 220px;
  text-align: center;
}

.fail-reason-field {
  background-color: rgba(0, 0, 0, 0);
  width: 240px;
  left: 15px;
  max-height: 60px;
  overflow: hidden;
}

.fail-reason-confirm-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  color: rgba(60, 60, 255, 0.65);
  text-align: center;
  width: 270px;
}

.popup-button {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  color: rgba(60, 60, 255, 0.65);
  text-align: center;
  width: 135px;
}

.grid-popup {
  width: 300px;
  padding: 10px;
  color: #ffc800;
  padding-top: 35px;
}
/deep/.van-grid-item__text {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}
</style>
