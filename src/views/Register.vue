<template>
  <div class="main-box">
    <van-popup
      v-model="show"
      :overlay="false"
      position="top"
      :close-on-popstate="false"
      duration="0.8"
    >
      <van-image
        fit="fill"
        :src="require('../assets//background-up.png')"
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
      class="background-popup-down"
    >
      <van-image
        fit="fill"
        :src="require('../assets//background-down.png')"
        class="background-img-down"
      />
    </van-popup>
    <!--用户名密码框+登录按钮-->
    <div class="form-box">
      <van-col span="18">
        <van-form @submit="onSubmit" class="form">
          <van-field
            v-model="username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="email"
            type="email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="[{ required: true, message: '' }]"
          />
          <van-field
            v-model="verifycode"
            name="验证码"
            label="验证码"
            placeholder="验证码"
            :rules="[{ required: true, message: '' }]"
          >
            <!-- 发送验证码按钮 -->
            <template #button>
              <van-button
                size="small"
                class="message-button"
                @click="sendMessage"
                :disabled="isDisable"
                :text="verifyMsg"
              ></van-button>
            </template>
          </van-field>
        </van-form>
      </van-col>
      <van-col span="6" offset="-1">
        <div id="submitButton">
          <van-button
            icon="plus"
            round
            block
            type="info"
            native-type="submit"
            color="linear-gradient(to right, #4bb0ff, #6149f6)"
            @click="onClickPlus"
          ></van-button>
        </div>
      </van-col>
    </div>
    <!--转入注册的按钮-->
    <van-popup
      v-model="show"
      id="turnToRegister"
      @click="goLogin"
      position="right"
      :round="true"
      :overlay="false"
      :close-on-click-overlay="false"
    >
      <p id="RegisterWord">Login</p>
    </van-popup>
  </div>
</template>

<script>
import RegisterForm from "../components/RegisterForm";
import { get } from "../router/request.js";

export default {
  name: "Register",
  components: { RegisterForm },
  data() {
    return {
      show: false,
      username: "",
      password: "",
      email: "",
      verifycode: "",
      verifyMsg: "发送验证码",
      isDisable: false,
      originalHeight: 0,
    };
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    goLogin() {
      this.$router.push("login");
    },
    onClickPlus() {
      if (
        this.email == "" ||
        this.username == "" ||
        this.password == "" ||
        this.verifycode == ""
      ) {
        return;
      }
      // 注册
      get({
        url: "/api/signup",
        params: {
          username: this.username,
          email: this.email,
          password: this.password,
          verifycode: this.verifycode,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 800,
            });
          } else {
            this.$notify({
              type: "success",
              message: "注册成功",
              duration: 500,
            });
            this.$router.push("login");
          }
        })
        .catch((res) => {
          this.$notify({
            type: "danger",
            message: "服务器连接失败",
            duration: 600,
          });
        });
    },
    onSubmit(values) {
      console.log("submit", values);
    },
    sendMessage() {
      if (this.email == "") {
        return;
      }
      // 发送验证码
      get({
        url: "/api/getVerifyCode",
        params: {
          email: this.email,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            this.$notify({
              type: "warning",
              message: res.data.msg,
              duration: 800,
            });
          } else {
            this.$notify({
              type: "success",
              message: "验证码发送成功",
              duration: 500,
            });
          }
        })
        .catch((res) => {
          this.$notify({
            type: "danger",
            message: "服务器连接失败",
            duration: 600,
          });
        });
      // 倒计时
      this.isDisable = true;
      var num = 10;
      var timer = setInterval((res) => {
        num--;
        this.verifyMsg = String(num) + "s后重试";
        if (num == 0) {
          this.isDisable = false;
          this.verifyMsg = "重新发送";
          clearInterval(timer);
        }
      }, 1000);
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
    }
  },

  mounted(to, form, next) {
    this.showPopup();
    this.isDisable = false;

    window.addEventListener('resize',this.listenResize);
    this.originalHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
  },
};
</script>

<style scoped>
#login {
  width: 80%;
  height: 50%;
  top: 65%;
}

#submitButton {
  width: 50px;
  height: 50px;
  padding-top: 70%;
}

#turnToRegister {
  top: 25%;
  width: 40%;
  height: 6%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

#RegisterWord {
  margin: auto;
  line-height: inherit;
  font-size: 25px;
  color: steelblue;
  text-align: center;
  padding-top: 10px;
}

.background-img-up {
  width: 100%;
  height: 50%;
}

.background-popup-down {
  background-color: rgba(0, 0, 0, 0);
  top: 71%;
  height: 29%;
}

.background-img-down {
  width: 100%;
  height: 100%;
}

.form {
  padding-left: 15px;
}

.form-box {
  position: absolute;
  top: 38%;
  width: 375px;
  border-radius: 60px;
}
.message-button {
  border: 0px;
  background-color: rgba(0, 0, 0, 0);
}
</style>