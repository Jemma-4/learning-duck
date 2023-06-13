<template>
  <div>
    <van-nav-bar
      id="navBar"
      title="创建自习室"
      left-text="自习室"
      right-text="确定"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-cell-group>
      <van-field v-model="roomName" label="自习室名称" placeholder="请输入自习室名" />
      <van-field v-model="upperBound" label="人数上限" placeholder="50" :readonly="defineNotAllow" />
    </van-cell-group>
    <van-cell center title="公开此自习室">
      <template #right-icon>
        <van-switch v-model="open" size="24" inactive-color="gray" />
      </template>
    </van-cell>
    <p class="explain">
      若选择公开，改自习室会出现在公开自习室列表中且可以按名称搜索到。
      若不公开，则仅可以通过加入码加入。
    </p>
    <van-cell center title="自定义人数上限">
      <template #right-icon>
        <van-switch
          @change="onDefineUpperBound"
          v-model="defineUpperBound"
          size="24"
          inactive-color="gray"
        />
      </template>
    </van-cell>
    <p class="explain">默认人数上限为50人，可自定义的范围是2~300人</p>
  </div>
</template>

<script>
export default {
  name: "CreateLearningRoom",
  data() {
    return {
      open: true,
      defineUpperBound: false,
      roomName: "",
      upperBound: "",
      defineNotAllow: true
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.$router.go(-1);
    },
    onDefineUpperBound() {
      console.log(this.defineNotAllow);
      this.defineNotAllow = !this.open;
    }
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

.explain {
  margin: 5px;
  color: gray;
  font-size: 10px;
}
</style>