<template>
  <div>
    <!--上方导航栏-->
    <van-nav-bar
      id="navBar"
      title="添加圈子"
      left-text="返回"
      right-text="确认"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <!--圈子名称-->
    <van-field v-model="groupName" label="名称" placeholder="输入圈子名称" />
    <van-row>
      <van-col span="16">
        <!--输入贴子描述-->
        <van-field
          v-model="groupDescribe"
          rows="3"
          maxlength="50"
          autosize
          show-word-limit
          label="圈子描述"
          type="textarea"
          placeholder="来说点什么描述圈子吧，点击右侧选择圈子图片"
        />
      </van-col>
      <van-col span="8">
        <!--选择圈子图片-->
        <div id="imageChooser">
          <van-uploader v-model="fileList" preview-size="100px" multiple :max-count="1" />
        </div>
      </van-col>
    </van-row>
    <van-divider class="innerDivider" />
    <!--输入圈子公告-->
    <van-field
      v-model="notice"
      rows="5"
      maxlength="200"
      autosize
      show-word-limit
      label="圈子公告"
      left-icon="smile-comment"
      type="textarea"
      :border="false"
      placeholder="作为圈主给这个圈子发布一个公告"
    />
    <van-divider class="divider" hairline dashed />
    <!--输入圈子公告-->
    <van-field
      v-model="reason"
      rows="5"
      autosize
      show-word-limit
      label="申请理由"
      left-icon="invition"
      type="textarea"
      placeholder="写清你申请这个圈子的理由，方便管理员审核哦"
    />
  </div>
</template>

<script>
import { get, post } from "../router/request.js";
import { Toast } from "vant";

export default {
  name: "CreateGroup",
  data() {
    return {
      userId: 0,   // 传进来
      groupName: "",
      groupDescribe: "",
      notice: "",
      reason: "",
      fileList: [],
    };
  },
  methods: {
    //点击左侧返回的响应函数
    onClickLeft() {
      this.$router.go(-1);
    },
    //点击右侧确认按钮的响应函数
    onClickRight() {
      if (this.groupName == "" || this.groupDescribe == "") {
        Toast("圈子名和描述不能为空鸭~");
        return;
      }
      if (this.fileList.length == 0) {
        Toast("请选一张图片作为头像~");
        return;
      }

      var formData = new FormData();
      formData.append("userid", this.userId);
      formData.append("groupname", this.groupName);
      formData.append("backgroundimage", this.fileList[0].file);
      formData.append("description", this.groupDescribe);
      formData.append("announcement", this.notice);
      formData.append("reason", this.reason);

      post({
        url: "/api/createGroup",
        data: formData,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.ok == 0) {
            Toast(res.data.msg);
            return;
          }
          Toast("提交成功");
          // 此处跳转
          this.$router.go(-1);
        })
        .catch((res) => {
          Toast("提交失败");
        });
    },
  },
  mounted(){
    this.userId = this.$cookies.get("userid");
  }
};
</script>

<style scoped>
#navBar {
  top: 0px;
  width: 100%;
  background-color: #ffc800;
}

/deep/ .van-ellipsis {
  color: white;
}

/deep/ .van-nav-bar .van-icon {
  color: white;
}

/deep/ .van-nav-bar__text {
  color: white;
}

#imageChooser {
  margin: 10px;
}

.innerDivider {
  margin: 0px;
}

.divider {
  margin: 5px;
}
</style>