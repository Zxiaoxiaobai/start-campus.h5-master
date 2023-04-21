<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell-group>
            <van-cell is-link @click="toUserBasic">
                <template #title>
                    <van-space :size="5">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jibenxinxi"></use>
                        </svg>
                        <span>基本信息</span>
                    </van-space>
                </template>
            </van-cell>
            <van-cell is-link @click="toUpdatePassword">
                <template #title>
                    <van-space :size="5">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-drxx25"></use>
                        </svg>
                        <span>修改密码</span>
                    </van-space>
                </template>
            </van-cell>
            <van-cell is-link @click="toUpdatePhone">
                <template #title>
                    <van-space :size="5">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bangdingshoujihao"></use>
                        </svg>
                        <span>修改手机号</span>
                    </van-space>
                </template>
                <template #value>
                    {{ data.userInfo.phone }}
                </template>
            </van-cell>
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="logOut">
                退出登录
            </van-button>
        </div>
    </div>
</template>

<script>
import {getUserInfo, removeToken, removeUserInfo} from "@/utils/auth";
import {Notify} from "vant";
import {useRouter} from 'vue-router'
import {reactive} from "vue";
import Navbar from "@/components/navbar/navbar";

export default {
    name: "set",
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '设置',
            navbarPath: '/user/person',
            userInfo: getUserInfo()
        })
        const router = useRouter();
        const logOut = async () => {
            removeToken();
            removeUserInfo();
            Notify({type: 'success', message: '退出成功'});
            setTimeout(function () {
                router.push("/login")
            }, 2000)
        }
        /**
         * 跳转到基本信息
         */
        const toUserBasic = () => {
            router.push("/user/basic")
        }
        /**
         * 跳转到修改密码界面
         */
        const toUpdatePassword = () => {
            router.push("/user/updatePassword")
        }
        /**
         * 跳转到修改手机号界面
         */
        const toUpdatePhone = () => {
            router.push("/user/updatePhone")
        }
        return {
            data,
            logOut,
            toUserBasic,
            toUpdatePassword,
            toUpdatePhone
        }
    }
}
</script>

<style scoped>

</style>