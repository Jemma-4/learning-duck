<template>
  <div>
    <!--上面搜索的导航栏-->
    <van-sticky :offset-top="0" class="top">
      <div style="height:90px;background-color:#ffc800;">
        <div style="height:37px;" />
        <van-row>
          <van-col span="20">
            <van-search
              class="search"
              v-model="keyword"
              shape="round"
              background="#ffc800"
              :show-action="true"
              placeholder="请输入搜索关键词"
              style="bottom:0px;"
              @search="onSearch"
              @cancel="onCancel"
            ></van-search>
          </van-col>
          <van-col span="4">
            <div class="energy-col">
              <van-image class="energy-icon" :src="require('../assets/state-'+energyLevel+'.png')" />
              <div>{{this.energy}}/100</div>
            </div>
          </van-col>
        </van-row>
      </div>
    </van-sticky>

    <router-view />
  </div>
</template>

<script>
import InvitationList from "../views/InvitationList.vue";
import InvitationDetailList from "../views/InvitationDetailList.vue";
import {Toast} from "vant"
export default {
  name: "LearningCommunity",
  data() {
    return {
      keyword: "",
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
    onSearch() {
      if(this.keyword=="")
      {
        Toast("搜索内容不能为空");
      }else{
        this.$router.push("/home/discovery/search/" + this.keyword);
      }
    },
    onCancel() {
      if (this.$route.path.split("/")[3] == "search") {
        this.$router.push("/home/discovery/detail");
      }
    }
  },
  mounted(){
    this.energy = this.$cookies.get("power")
  }
};
</script>

<style scoped>
.search {
  color: white;
  height: 25px;
  padding-top:25px;
}

/deep/.van-search__action {
  color: white;
}

.energy-col{
  width:40px;
  height:20px;
  font-size: 10px;
  color:white;
  padding-top:15px;
  padding-left:10px;
}

/deep/.van-search__content.van-search__content--round
{
  height:30px;
  line-height: 30px;
  background-color:rgb(245,245,245);
}
</style>