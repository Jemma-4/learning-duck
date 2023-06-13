<template>
  <div id="Setting">
    <div class="topblock">
      <van-button
        class="returnbutton"
        round
        :icon="require('../assets/back-white.png')"
        @click="tabReturnBtn()"
      ></van-button>
    </div>
    <div class="divider" style="background-color: rgba(0, 0, 0, 0.1);  height: 1px;  width: 100%;"></div>

    <div class="cellGroup">
      <van-cell-group title=" ">
        <van-cell
          title="我的用户名"
          :value="username"
          :icon="require('../assets/username.png')"
          @click="tabNameBtn()"
        />
        <van-cell title="我的密码" :icon="require('../assets/password.png')" @click="tabPwdBtn()" />
        <van-cell title="我的头像" :icon="require('../assets/headimage.png')" @click="tabImgBtn()" />
        <van-cell
          title="性别"
          :value="sex"
          :icon="require('../assets/sex.png')"
          @click="tabSexBtn()"
        />
      </van-cell-group>
    </div>

    <div>
      <van-button class="get-out-button"
      @click="getout()">退出登录</van-button>
    </div>
    <van-divider/>

    <van-popup
      v-model="changename"
      class="popUp"
      duration="0.3"
      closeable
      round
      close-icon-position="top-right"
      :close-icon="require('../assets/close.png')"
    >
      <div class="head-background" />
      <div class="body-background" />
      <textarea
        v-model="username"
        :border="true"
        maxlength="150"
        :center="true"
        autosize
        placeholder="请输入新用户名"
        class="content-field"
      />
      <div class="tab-body-background" />
      <van-button class="submit-button" @click="changeName()">确定</van-button>
    </van-popup>

    <van-popup
      v-model="changepwd"
      class="popUp"
      duration="0.3"
      closeable
      round
      close-icon-position="top-right"
      :close-icon="require('../assets/close.png')"
    >
      <div class="head-background" />
      <div class="body-background" />
      <van-field
        v-model="password"
        :border="true"
        type="password"
        maxlength="150"
        :center="true"
        autosize
        placeholder="请输入新密码"
      />
      <div class="tab-body-background" />
      <van-button class="submit-button" @click="changePwd()">确定</van-button>
    </van-popup>

    <van-popup
      v-model="changeimg"
      class="popUp"
      duration="0.3"
      closeable
      round
      close-icon-position="top-right"
      :close-icon="require('../assets/close.png')"
    >
      <div class="head-background" />
      <div class="body-background" />
      <div id="imageChooser">
        <van-uploader v-model="imgList" preview-size="110px" multiple :max-count="1" />
      </div>
      <div class="tab-body-background" />
      <van-button class="submit-button" @click="changeImg()">确定</van-button>
    </van-popup>

    <van-popup v-model="changesex" duration="0.3" position="bottom" closeable:false>
      <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import { post } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "Setting",
  data() {
    return {
      username: "0",
      password: "123456",
      userid: 0,
      imgList: [],
      imgurl: "https://img.yzcdn.cn/vant/cat.jpeg",
      sex: "男",
      columns: ["男", "女"],
      changename: false,
      changepwd: false,
      changeimg: false,
      changesex: false,
    };
  },
  computed: {},
  methods: {
    tabReturnBtn() {
      this.$router.go(-1);
    },
    tabNameBtn() {
      this.changename = true;
    },
    tabPwdBtn() {
      this.changepwd = true;
    },
    tabSexBtn() {
      this.changesex = true;
    },
    tabImgBtn() {
      this.changeimg = true;
    },
    changeName() {
      if(this.username == "" || this.username.length < 3){
        Toast("用户名须大于3个字符");
        return;
      }
      var formData = new FormData();
      formData.append("userid", this.userid);
      formData.append("username", this.username);
      formData.append("type", 0);
      post({
        url: "/api/updateUserInfo",
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            Toast(res.data.msg);
            return;
          }
          Toast("发送成功");
          console.log(res.data);
          this.$cookies.set("username", this.username);
        })
        .catch((res) => {
          Toast("发送失败");
        });
      this.changename = false;
    },
    changePwd() {
      if(this.password == "" || this.password.length < 6){
        Toast("密码不能小于6个字符");
        return;
      }
      var formData = new FormData();
      formData.append("userid", this.userid);
      formData.append("password", this.password);
      formData.append("type", 1);
      post({
        url: "/api/updateUserInfo",
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            Toast(res.data.msg);
            return;
          }
          Toast("发送成功");
          console.log(res.data);
        })
        .catch((res) => {
          Toast("发送失败");
        });
      this.changepwd = false;
    },
    changeImg() {
      var formData = new FormData();
      formData.append("userid", this.userid);
      this.imgList.forEach(file => {
        formData.append("imgList", file.file);
      });
      formData.append("type", 2);
      post({
        url: "/api/updateUserInfo",
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            Toast(res.data.msg);
            return;
          }
          Toast("发送成功");
          console.log(res.data);
          this.$cookies.set("userheadimg", res.data.imgurl);
        })
        .catch((res) => {
          Toast("发送失败");
        });
      this.changeimg = false;
    },
    onConfirm(value, index) {
      this.sex = value;
      var formData = new FormData();
      formData.append("userid", this.userid);
      formData.append("sex", this.sex=="男"?0:1);
      formData.append("type", 3);
      post({
        url: "/api/updateUserInfo",
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            Toast(res.data.msg);
            return;
          }
          Toast("发送成功");
          console.log(res.data);
          this.$cookies.set("sex", index);
        })
        .catch((res) => {
          Toast("发送失败");
        });
      this.changesex = false;
      
      //console.log(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      this.changesex = false;
    },
    getout(){
      //此处更新cookie 退出登录
      this.$cookies.remove("userid");
      this.$router.push('/');
      Toast("退出成功");
    }
  },
  mounted() {
    this.username = this.$cookies.get("username");
    this.userid = this.$cookies.get("userid");
    this.sex = this.$cookies.get("sex") == "0" ? "男":"女";
  }
};
</script>

<style scoped>
#imageChooser {
  margin: 10px;
}

.topblock {
  padding-top: 10px;
  padding-left: 10px;
  height: 40px;
  background-color: #ffc800;
}

.returnbutton {
  bottom: 5px;
  width: 20px;
  height: 20px;
  border: none;
  background-color: #ffc800;
}

.cellGroup {
  padding-top: 25px;
}

.van-cell__title {
  padding-left: 6px;
  font-size: 16px;
  font-weight: bold;
}

.popUp {
  width: 300px;
}

.head-background {
  background-color: #ffc800;
  width: 300px;
  height: 40px;
}
.body-background {
  background-color: white;
  width: 300px;
  height: 15px;
}

.content-field {
  width: 275px;
  left: 40px;
  border: 0px;
  font-size: 14px;
  max-height: 60px;
  overflow: hidden;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.01);
  padding-left: 15px;
}
.submit-button {
  height: 30px;
  width: 150px;
  border: 0px;
  border-radius: 4px;
  font-size: 14px;
  left: 65px;
  bottom: 13px;
  background-color: rgba(255, 216, 0, 0.2);
}
.tab-body-background {
  background-color: white;
  width: 280px;
  height: 8px;
}
.get-out-button{
  padding-left: 43px;
  font-size: 16px;
  font-weight: bold;
  border:0px;
  height:30px;
  margin:0px;
}
</style>