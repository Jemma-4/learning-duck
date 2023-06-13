<template>
  <div>
    <!--上方导航栏-->
    <div style="height:45px;background-color:#ffc800;"/>
    <van-nav-bar
      id="navBar"
      title="发布贴子"
      left-text="返回"
      right-text="确认"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      style="top:-1px;"
    />
    <!--选择发布的圈子-->
    <van-cell @click="onChooseGroup" title="选择圈子发布" :value="groupMsg" is-link icon="wap-home" />
    <!--选择上传的图片-->
    <div id="imageChooser">
      <van-uploader v-model="fileList" preview-size="110px" multiple :max-count="3" />
    </div>
    <van-field v-model="title" label="标题" placeholder="输入贴子标题" />
    <!--输入贴子内容-->
    <van-field
      v-model="content"
      rows="5"
      maxlength="500"
      autosize
      show-word-limit
      label="贴子内容"
      type="textarea"
      placeholder="来说点什么描述作品吧"
    />
    <van-cell title="添加主题标签" icon="location" />
    <!--为贴子添加标签-->
    <van-field
      v-model="tag"
      rows="1"
      autosize
      type="textarea"
      placeholder="添加一些tag,让贴子更容易被理解吧! 多标签用空格隔开"
    />
    <van-cell title="设置费用" icon="gold-coin" />
    <!--为贴子添加标签-->
    <van-field
      v-model="getPaid"
      rows="1"
      autosize
      type="digit"
      placeholder="设置一个亲民的价格吧"
      label="鸭蛋"
    />
    <!--选择圈子的弹窗-->
    <van-popup
      v-model="chooseGroup"
      id="groupList"
      duration="0.3"
      closeable
      round
      close-icon-position="top-right"
      :close-icon="require('../assets/close.png')"
      class="add-clock-popup"
    >
      <!--子组件，黄条条是子组件定义的-->
      <div class="head-background" />
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in groupList" :key="item.groupid" @click="onChooseGroupItem(item)">
            <van-row id="groupListItem">
              <van-col span="8">
                <van-image fit="cover" :src="item.backgroundimage" />
              </van-col>
              <van-col span="15" offset="1">
                <b id="groupTitle">{{item.groupname}}</b>
                <p id="groupDescribe">{{item.description}}</p>
              </van-col>
            </van-row>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </van-popup>
  </div>
</template>

<script>
import { get, post } from "../router/request.js";
import { Toast } from "vant";
export default {
  name: "Post",
  data() {
    return {
      userId: 0, // 当前用户id（传进来）
      fileList: [],
      list: [],
      content: "",
      tag: "",
      title: "",
      loading: false,
      finished: false,
      refreshing: true,
      chooseGroup: false,
      chosedGroupId: 1,
      groupMsg: "让作品更容易被发现",
      groupPage: 0,
      maxNum: 0,
      getPaid: 0,
      groupList: [],
      defaultGroup: {
        groupid: 1,
        groupname: "无圈子",
        description: "不选择任何圈子",
        backgroundimage: require("../assets/mine-active.png")
      }
    };
  },
  methods: {
    //点击左侧返回的响应函数
    onClickLeft() {
      this.$router.go(-1);
    },
    //点击右侧发布的响应函数
    onClickRight() {
      if (this.title == "" || this.content == "") {
        Toast("标题和内容不能为空鸭~");
        return;
      }
      var tags = this.tag.split(" ");
      console.log(tags);
      var formData = new FormData();
      formData.append("title", this.title);
      formData.append("text", this.content);
      formData.append("userid", this.userId);
      formData.append("groupid", this.chosedGroupId);
      tags.forEach(tag => {
        formData.append("tag", tag);
      });
      this.fileList.forEach(file => {
        formData.append("imgList", file.file);
      });
      post({
        url: "/api/postWork",
        data: formData
      })
        .then(res => {
          console.log(res.data);
          if (res.data.ok == 0) {
            Toast("发送失败");
            return;
          }
          Toast("发送成功");
          console.log(res.data);
          this.$router.go(-1);
          // 此处跳转
        })
        .catch(res => {
          Toast("发送失败");
        });
    },
    //点击选择圈子的响应函数
    onChooseGroup() {
      this.chooseGroup = true;
    },
    //点击了圈子某一项的响应函数
    onChooseGroupItem(item) {
      //console.log(key)
      this.chooseGroup = false;
      this.chosedGroupId = item.groupid;
      this.groupMsg = "已选择：" + item.groupname;
      console.log(this.chosedGroupId);
    },
    //下拉刷新列表的两个响应函数
    onLoad() {
      if (this.refreshing) {
        this.groupList = [];
        this.groupList.push(this.defaultGroup);
        this.refreshing = false;
      }
      this.groupPage += 1;
      get({
        url: "/api/getGroupList",
        params: {
          userid: this.userId,
          page: this.groupPage
        }
      })
        .then(res => {
          if (res.data.ok == 1) {
            this.maxNum = res.data.max;
            res.data.groupList.forEach(element => {
              this.groupList.push(element);
            });
            this.loading = false;
          }
          if (this.groupList.length >= this.maxNum) {
            this.finished = true;
          }
        })
        .catch(res => {
          this.finished = true;
        });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.groupPage = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
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

#groupList {
  height: 600px;
  overflow: -moz-scrollbars-none;
}

.head-background {
  background-color: #ffc800;
  width: 300px;
  height: 40px;
}

#groupTitle {
  font-size: 18px;
  color: black;
}

#groupDescribe {
  margin-top: 0px;
}
</style>