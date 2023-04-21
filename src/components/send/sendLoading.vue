<template>
    <div>
        <van-overlay :show="showLoading">
            <div class="wrapper">
                <div class="block">
                    <!-- 只修改文案颜色 -->
                    <van-loading text-color="#0094ff">
                        发送中...
                    </van-loading>
                </div>
            </div>
        </van-overlay>
    </div>
</template>
<script>
import {reactive} from "vue";
export default ({
    name: 'loading',
    props: {
        showLoading:Boolean
    },
    setup() {
        const data = reactive({

        })
        return {
            data
        }
    }
})
</script>
<style>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.block {
    width: 120px;
    height: 120px;
}
</style>