<template>
  <div>
    <router-view></router-view>
    <van-tabbar v-model="active" class="active_tab">
      <van-tabbar-item
        v-for="(item,index) in tabbars"
        :placeholder="true"
        :fixed="true"
        :key="index"
        @click="tab(index,item.name)"
      >
        <span :class="currIndex == index ? active:''">{{item.title}}</span>
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? item.active : item.normal">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      currIndex: 0,
      active: 0,
      tabbars: [
        {
          name: "efficiency",
          title: "首页",
          normal: require("../assets/efficiency.png"),
          active: require("../assets/efficiency-active.png")
        },
        {
          name: "discovery",
          title: "发现",
          normal: require("../assets/discovery.png"),
          active: require("../assets/discovery-active.png")
        },
        {
          name: "post",
          title: "",
          normal: require("../assets/post.png"),
          active: require("../assets/post-active.png")        
        },
        {
          name: "group",
          title: "圈子",
          normal: require("../assets/group.png"),
          active: require("../assets/group-active.png")        
        },
        {
          name: "mine",
          title: "我的",
          normal: require("../assets/mine.png"),
          active: require("../assets/mine-active.png")        
        }
      ]
    };
  },
  methods: {
    tab(index, val) {
      this.currIndex = index;
      this.active=index
      this.$router.push("/home/"+val);
    }
  },
  mounted(){
  }
};
</script>

<style scoped>
.active_tab img {
  width: 27px;
  height: 27px;
}

.van-tabbar-item--active {
  color: #ffc800;
}
</style>