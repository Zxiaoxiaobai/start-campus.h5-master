<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell-group>
            <van-notice-bar
                wrapable
                :scrollable="false"
            >
                <template #default>
                    <span style="display: flex">密码修改注意事项：</span>
                    <span style="display: flex">1，第一次修改原密码默认为123456</span>
                    <span style="display: flex">2，密码长度6-12、必须包含英文和数字</span>
                </template>
            </van-notice-bar>
            <van-form @submit="updateUserPassword">
                <van-field
                    v-model="updatePasswordRo.oldPassword"
                    name="旧密码"
                    label="旧密码"
                    type="password"
                    required
                    placeholder="请填写旧密码"
                    :rules="[{ required: true, message: '请填写旧密码' }]"
                />
                <van-field
                    v-model="updatePasswordRo.newPassword"
                    name="新密码"
                    label="新密码"
                    type="password"
                    required
                    placeholder="请填写新密码"
                    :rules="[{ required: true, message: '请填写新密码' }]"
                />
                <van-field
                    v-model="updatePasswordRo.rePassword"
                    name="确认密码"
                    label="确认密码"
                    type="password"
                    required
                    placeholder="请填写确认密码"
                    :rules="[{ required: true, message: '请填写确认密码' }]"
                />
                <div style="margin: 16px;">
                    <van-button round block type="primary" native-type="submit">
                        确认修改
                    </van-button>
                </div>
            </van-form>
        </van-cell-group>
    </div>
</template>

<script>
import {reactive} from "vue";
import {updatePassword} from "@/api/user/user";
import {Notify} from "vant";
import {setToken} from "@/utils/auth";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '修改密码',
            navbarPath: '/user/set',
        })
        const updatePasswordRo = reactive({
            oldPassword: '',
            newPassword: '',
            rePassword: ''
        })
        /**
         * 修改密码
         */
        const updateUserPassword = () => {
            updatePassword(updatePasswordRo).then(res => {
                Notify({type: 'success', message: '密码修改成功'});
                // 重新设置token
                setToken(res.data)
            })
        }
        return {
            data,
            updatePasswordRo,
            updateUserPassword,
        }
    }
}
</script>