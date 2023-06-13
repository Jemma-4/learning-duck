<template>
    <van-form @submit="onSubmit">
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
                :rules="[{ required: true, message: '请填写邮箱' }]"
        />
    </van-form>
</template>

<script>
    export default {
        name: "RegisterForm",
        data() {
            return {
                username: '',
                password: '',
                email: '',
            };
        },
        methods: {
            onSubmit(values) {
                console.log('submit', values);
            },
        },
    }
</script>

<style scoped>

</style>