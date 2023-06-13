<template>
  <div class="about">
    <h1>This is an about page</h1>
    <van-button type="warning">警告按钮</van-button>  
    <div class="test-viewport">测试转换</div>
</div>
</template>

<script>
export default {
  name: 'About',


};
</script>

<style scoped>
.test-viewport {
  width: 200px;
  height: 100px;
  font-size: 20px;
  text-align: center;
  line-height: 100px;
  background: #13b5b1;
}
</style>