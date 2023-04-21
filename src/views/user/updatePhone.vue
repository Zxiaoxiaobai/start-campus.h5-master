<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell-group>
            <van-notice-bar
                wrapable
                :scrollable="false"
            >
                <template #default>
                    <span style="display: flex">手机号修改注意事项：</span>
                    <span style="display: flex">1，修改手机号后原手机号作废</span>
                    <span style="display: flex">2，若是QQ/微信登录，修改手机号后可以通过手机号登录</span>
                </template>
            </van-notice-bar>
            <van-form @submit="updateUserPhone">
                <van-field v-model="updatePhoneRo.newPhone" name="phone" placeholder="请输入新手机号"
                           :rules="[{ required: true, message: '请输入新手机号' }]"/>
                <van-field
                    v-model="updatePhoneRo.code"
                    center
                    clearable
                    placeholder="请输入短信验证码"
                    :rules="[{ required: true, message: '请输入验证码' }]"
                >
                    <template #button>
                        <van-button v-if="!data.countDownIng" size="small" type="primary" @click="sendSmsCode">
                            发送验证码
                        </van-button>
                        <span v-if="data.countDownIng">{{ data.countDownTime }}s后重新发送</span>
                    </template>
                </van-field>
                <div style="margin: 16px;">
                    <van-button round block type="primary" native-type="submit">
                        确认修改
                    </van-button>
                </div>
            </van-form>
        </van-cell-group>
        <send-loading :show-loading="sendShow"/>
    </div>
</template>
<script>
import {onMounted, reactive, ref} from "vue";
import {Notify} from "vant";
import {sendSms} from "@/api/sms/sms";
import {currentUserInfo, updatePhone} from "@/api/user/user";
import {useRouter} from "vue-router";
import {setUserInfo} from "@/utils/auth";
import Navbar from "@/components/navbar/navbar";
import SendLoading from "@/components/send/sendLoading";
export default {
    components: {Navbar,SendLoading},
    setup() {
        const sendShow = ref(false);
        const data = reactive({
            navbarTitle: '修改手机号',
            navbarPath: '/user/set',
            countDownIng: false,
            getCodeDisabled: false,
        })
        const updatePhoneRo = reactive({
            newPhone: '',
            code: ''
        })
        const sendSmsRo = reactive({
            phone: ''
        })
        const router = useRouter();
        /**
         * 发送验证码
         */
        const sendSmsCode = () => {
            if (updatePhoneRo.newPhone === '') {
                Notify({type: 'danger', message: '请输入新手机号', duration: 1000});
                return;
            }
            const phonePattern = /^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if (updatePhoneRo.newPhone.length < 11 || !phonePattern.test(updatePhoneRo.newPhone)) {
                Notify({type: 'danger', message: '请输入正确的手机号', duration: 1000});
                return;
            }
            if (data.getCodeDisabled) {
                Notify({type: 'danger', message: '请' + data.countDownTime + 's后再试', duration: 1000});
                return;
            }
            sendShow.value = true
            sendSmsRo.phone = updatePhoneRo.newPhone
            // 短信类型为修改手机号
            sendSmsRo.type = 2
            sendSms(sendSmsRo).then(() => {
                Notify({type: 'success', message: '验证码发送成功', duration: 1000});
                countDown()
            }).finally(() => {
                sendShow.value = false
            })
        }
        /**
         * 倒计时
         */
        const countDown = () => {
            let startTime = localStorage.getItem('codeTime');
            let nowTime = new Date().getTime();
            if (startTime) {
                let surplus = 60 - parseInt((nowTime - startTime) / 1000, 10);
                data.countDownTime = surplus <= 0 ? 0 : surplus;
            } else {
                data.countDownTime = 60;
                localStorage.setItem('codeTime', nowTime);
            }
            data.timer = setInterval(() => {
                data.countDownTime--;
                data.getCodeDisabled = true;
                data.countDownIng = true;
                if (data.countDownTime <= 0) {
                    localStorage.removeItem('codeTime');
                    clearInterval(data.timer);
                    data.countDownTime = 60;
                    data.countDownIng = false;
                    data.getCodeDisabled = false;
                }
            }, 1000)
        }
        /**
         * 修改手机号
         */
        const updateUserPhone = () => {
            updatePhone(updatePhoneRo).then(() => {
                Notify({type: 'success', message: '手机号修改成功', duration: 1000});
                // 重新设置手机号
                currentUserInfo().then(res => {
                    setUserInfo(res.data)
                    router.push("/user/person")
                })
            })
        }
        const onClickLeft = async () => {
            history.back();
        }
        onMounted(() => {
            data.countDownIng = false
            let nowTime = new Date().getTime();
            let sendEndTime = localStorage.getItem('codeTime');
            if (sendEndTime) {
                let surplus = 60 - parseInt((nowTime - sendEndTime) / 1000, 10);
                data.countDownTime = surplus <= 0 ? 0 : surplus;
                data.timer = setInterval(() => {
                    data.countDownTime--;
                    data.getCodeDisabled = true;
                    if (data.countDownTime <= 0) {
                        localStorage.removeItem('codeTime');
                        clearInterval(data.timer);
                        data.countDownTime = 60;
                        data.countDownIng = false;
                        data.getCodeDisabled = false
                    }
                }, 1000)
            }
        })
        return {
            data,
            updatePhoneRo,
            sendShow,
            sendSmsCode,
            updateUserPhone,
            onClickLeft
        }
    }
}
</script>