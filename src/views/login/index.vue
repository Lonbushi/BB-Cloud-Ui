<template>
    <div ref="vantaRef" class="bg"></div>
    <div class="main">
        <div class="logo">
            <span class="iconfont icon-yunshuju" @click="loginDialogRef.dialogVisible = true"></span>
            <span class="font-logo">蹦蹦云</span>
        </div>
        <div class="main-text">
            <div class="text">
                记录每一份热爱
            </div>
            <div class="text">
                让美好永远陪伴
            </div>
            <div class="text-sm">
                我们不仅是在收藏回忆,更是在铸造一段属于我们的故事。每一个笑声,每一次拥抱,都是我们共同创造的珍贵瞬间。
            </div>
            <el-button class=" bg-cyan-800 hover:bg-teal-700 border-cyan-800 hover:border-cyan-800" size="large"
                type="primary" @click="loginDialogRef.dialogVisible = true" round>去登陆
            </el-button>
            <LoginDialog ref="loginDialogRef" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import Clouds from "vanta/src/vanta.clouds";
import { ref, onMounted } from 'vue'
import * as THREE from 'three';
import LoginDialog from '@/components/LoginDialog.vue'
const loginDialogRef = ref<any>()
const vantaRef = ref(null);
let vantaEffect = null;
onMounted(() => {
    vantaEffect = Clouds({
        el: vantaRef.value,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 700.00,
        minWidth: 200.00,
        backgroundColor: 0x1e0000,
        sunColor: 0xff5617
    })
})

</script>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.iconfont {
    font-size: 2.5rem;
    --tw-text-opacity: 1;
    color: rgb(22 78 99 / var(--tw-text-opacity));
}

.bg {
    width: $w-sreach;
    height: $h-sreach;
    z-index: -40;
    position: relative;
}

.main {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    color: rgba($main-text-color, 1);
    -webkit-font-smoothing: antialiased;
}

.logo {
    display: flex;
    align-items: center;
    justify-self: start;
    cursor: pointer;
    margin: 1.25rem;
}

.font-logo {
    font-size: 18px;
    font-weight: 600;
    margin-left: 0.4rem;
    vertical-align: inherit;
}

.main-text {
    width: 80%;
    height: 50%;
    font-weight: 700;
    text-align: start;
    position: absolute;
    top: 25%;
    left: 15%;
}

.text {
    font-size: 3.75rem;
    margin-bottom: 1.25rem;
}

.text-sm {
    font-size: 24px;
    /* 12px */
    line-height: 2rem;
    /* 16px */
    font-weight: 500;
    margin-bottom: 1.25rem;
}
.el-button{
    background-color: rgba($main-text-color, 1);
    border-color: rgba($main-text-color, 1);
}
.el-button:hover{
    background-color: rgba($main-text-color, 1);
    border-color: rgba($main-text-color, 1);
}
@media (max-width: 640px) {
    .main-text{
        left: 10%;
        text-align: center;
    }
    .text{
        font-size: 2.25rem;

    }
    .text-sm{
        font-size: 0.75rem;
    }
}
</style>
