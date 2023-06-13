<template>
  <div>
    <!--上行背景的黄色部分-->
    <van-popup
      v-model="show"
      :overlay="false"
      position="top"
      :close-on-popstate="false"
      duration="0.8"
    >
      <van-image
        fit="fill"
        :src="require('../assets/background-up.png')"
        class="background-img-up"
      />
    </van-popup>
    <!--下行背景的蓝色部分-->
    <van-popup
      v-model="show"
      :overlay="false"
      position="bottom"
      :close-on-popstate="false"
      :safe-area-inset-bottom="false"
      duration="0.8"
      class="background-img-down"
    >
      <van-image
        fit="fill"
        :src="require('../assets/background-down.png')"
        class="background-img-down"
      />
    </van-popup>
    <!--用户名密码框+登录按钮-->
    <van-popup
      v-model="fieldshow"
      id="login"
      position="left"
      :round="true"
      :overlay="false"
      duration="0.8"
      :close-on-click-overlay="false"
    >
      <van-col span="18">
        <!-- <LoginForm></LoginForm> -->
        <van-form @submit="onSubmit">
          <van-field
            v-model="username"
            name="用户名"
            label="用户名"
            placeholder="用户名或邮箱"
            :rules="[{ required: true, message: '' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '' }]"
          />
        </van-form>
      </van-col>
      <van-col span="6">
        <div style="margin: 16px;" id="submitButton">
          <van-button
            icon="arrow"
            @click="goHome"
            round
            block
            type="info"
            native-type="submit"
            color="linear-gradient(to right, #4bb0ff, #6149f6)"
          ></van-button>
        </div>
      </van-col>
    </van-popup>
    <!--转入注册的按钮-->
    <van-popup
      v-model="show"
      id="turnToRegister"
      @click="goRegister"
      position="left"
      duration="0.8"
      :round="true"
      :overlay="false"
      :close-on-click-overlay="false"
    >
      <p id="RegisterWord">Register</p>
    </van-popup>
  </div>
</template>

<script>
// import LoginForm from "../components/LoginForm";
import { get } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "Login",
  //   components: { LoginForm },
  data() {
    return {
      show: false,
      fieldshow: false,
      username: "",
      password: "",
      originalHeight: 0,
    };
  },
  methods: {
    showPopup() {
      this.show = true;
      this.fieldshow = true;
    },
    goHome() {
      get({
        url: "/api/login",
        params: {
          username: this.username,
          password: this.password
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 600
            });
          } else if (res.data.isadministrator == 1) {
            this.$notify({
              type: "success",
              message: "登录成功-->前往管理员界面",
              duration: 500
            });
            // 这里去管理员界面
            this.$cookies.set("admin",res.data.userinfo.userid);
            this.$router.push("manage")
          }else{
              this.$notify({
              type: "success",
              message: "登录成功",
              duration: 500
            });
            this.$cookies.config('3d')    // 全局cookie 3天过期
            this.$cookies.set("userid",res.data.userinfo.userid);
            this.$cookies.set("username",res.data.userinfo.username);
            this.$cookies.set("sex",res.data.userinfo.sex);
            this.$cookies.set("userheadimg",res.data.userinfo.headImage);
            this.$cookies.set("inRoom",res.data.userinfo.inRoom);
            this.$cookies.set("studytime",res.data.userinfo.studytime);
            if(res.data.userinfo.inRoom)
            { 
              this.$cookies.set("roomname",res.data.userinfo.roomname);
              this.$cookies.set("roomid",res.data.userinfo.roomid);
            }
            this.$cookies.set("workNum",res.data.userinfo.workNum);
            this.$cookies.set("careNum",res.data.userinfo.careNum);
            this.$cookies.set("fansNum",res.data.userinfo.fansNum);
            this.$cookies.set("groupNum",res.data.userinfo.groupNum);
            this.$cookies.set("likeNum",res.data.userinfo.thumbsup);
            this.$cookies.set("credit",res.data.userinfo.credit);
            this.$cookies.set("power",res.data.userinfo.power);

            this.$router.push("home");
          }
        })
        .catch(res => {
            this.$notify({
              type: "danger",
              message: "服务器连接失败",
              duration: 600
            });
        });

      //   this.$router.push("home");
    },
    goRegister() {
      this.$router.push("register");
    },
    onSubmit(values) {
      console.log("submit", values);
    },
    listenResize(){
      var resizeHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      if (resizeHeight - 0 < this.originalHeight - 0) {
        //当软键盘弹起，在此处操作
        this.show = false;
      } else {
        //当软键盘收起，在此处操作
        this.show = true;
      }
    },
    // 加载用户信息
    loadUserInfo(){
      if(this.$cookies.isKey("userid")==false){
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
          console.log(res.data);
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 600
            });
          } else if (res.data.isadministrator == 1) {
            this.$notify({
              type: "success",
              message: "登录成功-->前往管理员界面",
              duration: 500
            });
            // 这里去管理员界面
          }else{
              this.$notify({
              type: "success",
              message: "自动登录成功",
              duration: 500
            });
            Toast("欢迎 " + res.data.username);
            this.$cookies.config('3d')    // 全局cookie 3天过期
            this.$cookies.set("userid",res.data.userid);
            this.$cookies.set("username",res.data.username);
            this.$cookies.set("sex",res.data.sex);
            this.$cookies.set("userheadimg",res.data.headImage);
            this.$cookies.set("inRoom",res.data.inRoom);
            this.$cookies.set("studytime",res.data.studytime);
            if(res.data.inRoom)
            { 
              this.$cookies.set("roomname",res.data.roomname);
              this.$cookies.set("roomid",res.data.roomid);
            }
            this.$cookies.set("workNum",res.data.workNum);
            this.$cookies.set("careNum",res.data.careNum);
            this.$cookies.set("fansNum",res.data.fansNum);
            this.$cookies.set("groupNum",res.data.groupNum);
            this.$cookies.set("likeNum",res.data.thumbsup);
            this.$cookies.set("credit",res.data.credit);
            this.$cookies.set("power",res.data.power);

            this.$router.push("home");
          }
        })
        .catch(res => {
            this.$notify({
              type: "danger",
              message: "服务器连接失败",
              duration: 600
            });
        });
    }
  },

  mounted(to, form, next) {
    this.showPopup();
    window.addEventListener('resize',this.listenResize);
    this.originalHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    this.loadUserInfo();
  }
};
</script>

<style scoped>
#login {
  width: 80%;
  height: 18%;
}

#submitButton {
  width: 45px;
  height: 45px;
}

#turnToRegister {
  top: 68%;
  width: 40%;
  height: 6%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

#RegisterWord {
  margin: auto;
  padding-top: 10px;
  padding-bottom: 15px;
  font-size: 20px;
  color: orange;
  text-align: center;
}

.background-img-up {
  width: 100%;
  height: 50%;
}

.background-img-down {
  top: 55%;
  width: 100%;
  height: 45%;
}
</style>