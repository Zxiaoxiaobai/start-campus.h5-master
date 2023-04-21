<template>
    <div style="overflow: hidden" class="container">
        <!-- 登录 -->
        <div v-if="!data.isSendCode">
            <h1 class="title">嘿！ <br/>赶紧登录吧!</h1>
            <p class="sub-title">欢迎回来～ <br/>我们等你好久了!</p>
            <van-tabs v-model:active="data.active">
                <van-tab title="短信登录">
                    <div>
                        <van-form ref="loginFormRef">
                            <van-cell-group inset class="form-group">
                                <van-field v-model="loginForm.phone" placeholder="请输入手机号" class="form-field"/>
                            </van-cell-group>
                            <van-button type="primary" block round class="login-button" @click="sendSmsCode">下一步
                            </van-button>
                            <div class="forget-password">
                                <span>忘记密码？</span>
                            </div>
                        </van-form>
                    </div>
                </van-tab>
                <van-tab title="密码登录">
                    <div>
                        <van-cell-group inset class="form-group">
                            <van-field v-model="loginPasswordForm.loginAccount" placeholder="请输入手机号或邮箱或昵称"
                                       class="form-field"/>
                            <van-field v-model="loginPasswordForm.password" type="password" placeholder="请输入密码"
                                       class="form-field"/>
                        </van-cell-group>
                    </div>
                    <van-button type="primary" block round class="login-button" @click="submitLogin('password')">登录
                    </van-button>
                    <div class="forget-password">
                        <span>忘记密码？</span>
                    </div>
                </van-tab>
            </van-tabs>
            <van-divider
                :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
            >
                第三方登录
            </van-divider>
            <div class="third-login">
                <img src="../assets/static/image/QQ.png" class="login-qq" @click="qqLogin">
                <img src="../assets/static/image/QQ.png">
            </div>
            <p class="no-account"  @click="toRegister">没有账号? 点击这里</p>
        </div>
        <!-- 输入验证码 -->
        <div v-if="data.isSendCode">
            <img src="../assets/static/image/back.png" class="back-png" @click="data.isSendCode = false">
            <img src="../assets/static/image/验证码.png" class="frame-png">
            <p class="text">安全认证</p>
            <p class="code-text">我们已经发送6位数验证码至您的手机 <br/>请输入验证码以证明是您本人</p>
            <div>
                <van-password-input
                    :value="loginForm.code"
                    :mask="false"
                    :length="6"
                    :focused="data.showKeyboard"
                    @focus="data.showKeyboard = true"
                />
                <p class="reset-send" v-if="data.countDownIng">{{ data.countDownTime }}s后重新发送</p>
                <!-- 数字键盘 -->
                <van-number-keyboard
                    v-model="loginForm.code"
                    :show="data.showKeyboard"
                    @blur="data.showKeyboard = false"
                />
            </div>
            <van-button type="success" class="confirm-code" size="large" @click="submitLogin('code')">确认</van-button>
        </div>
        <send-loading :show-loading="sendShow"/>
    </div>
<!--  <van-button type="default" size="mini" url="https://beian.miit.gov.cn/"> 备案号</van-button>-->
  <van-button type="default" size="mini" url="https://beian.miit.gov.cn/"> 鄂ICP备2023004386号-1</van-button>
<!--  <a href="https://beian.miit.gov.cn/" target="_blank" >备案号</a>-->
<!--  <a href="https://beian.miit.gov.cn/" target="_blank" >鄂ICP备2023004386号-1</a>-->

</template>
<script>
import {onMounted, reactive, ref} from "vue";
import {loginByPhone, currentUserInfo, loginByPassword} from "@/api/user/user";
import {setToken, setUserInfo} from '@/utils/auth'
import {Notify} from "vant";
import {useRouter} from 'vue-router'
import {sendSms} from "@/api/sms/sms";
import SendLoading from "@/components/send/sendLoading";
import { flowerDrops } from '../assets/js/flowerDrops.js'
export default {
  created() {
      flowerDrops()
  },
  name: "login",
    components: {SendLoading},
    setup() {
        // 手机号登录Form
        const loginForm = reactive({
            phone: '',
            code: ''
        })
        // 密码登录Form
        const loginPasswordForm = reactive({
            loginAccount: '',
            password: ''
        })
        const sendSmsRo = reactive({
            phone: ''
        })
        const sendShow = ref(false);
        const data = reactive({
            active: 0,
            image: require('../assets/static/image/startcampus.jpg'),
            // 倒计时
            countDownTime: 60,
            timer: null,
            countDownIng: false,
            getCodeDisabled: false,
            qqLoginImage: require('../assets/static/image/QQ.png'),
            backImage: require('../assets/static/image/back.png'),
            codeImage: require('../assets/static/image/验证码.png'),
            isPhoneLogin: true,
            isPasswordLogin: false,
            isSendCode: false
        })
        const router = useRouter();
        /**
         * 发送验证码
         * @returns {Promise<void>}
         */
        const sendSmsCode = async () => {
            if (loginForm.phone === '') {
                Notify({type: 'danger', message: '请输入手机号', duration: 1000});
                return;
            }
            const phonePattern = /^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if (loginForm.phone.length < 11 || !phonePattern.test(loginForm.phone)) {
                Notify({type: 'danger', message: '请输入正确的手机号', duration: 1000});
                return;
            }
            if (data.getCodeDisabled) {
                Notify({type: 'danger', message: '请' + data.countDownTime + 's后再试', duration: 1000});
                return;
            }
            sendShow.value = true
            sendSmsRo.phone = loginForm.phone
            // 注册或者登录发送验证码
            sendSmsRo.type = 1
            sendSms(sendSmsRo).then(() => {
                Notify({type: 'success', message: '验证码发送成功', duration: 1000});
                data.isSendCode = true
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
         * 提交登录
         * @returns {Promise<void>}
         */
        const submitLogin = (type) => {
            if (type === 'code') {
                // 验证码登录
                loginByPhone(loginForm).then(res => {
                    setToken(res.data);
                    getCurrentUserInfo()
                })
            }
            if (type === 'password') {
                // 密码登录
                loginByPassword(loginPasswordForm).then(res => {
                    setToken(res.data);
                    getCurrentUserInfo()
                })
            }
        }
        /**
         * 获取当前用户信息
         * @returns {Promise<void>}
         */
        const getCurrentUserInfo = async () => {
            currentUserInfo().then(res => {
                setUserInfo(res.data);
                // 判断是否设置了基本信息
                if (!res.data.isSetBasicMessage) {
                    //  未设置，跳转到设置基本信息界面
                    router.push('/user/setBasicMessage')
                } else {
                    Notify({type: 'success', message: '登录成功', duration: 1000});
                    // 跳转到首页
                    setTimeout(() => {
                        router.push('/')
                    }, 2000);
                }
            })
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
        /**
         * qq登录方式
         */
        const qqLogin = () => {
            window.location.href = process.env.VUE_APP_BASEURL + '/user/login/pull-up-qq'
        }
        /**
         * 跳转到注册页面
         */
        const toRegister = () => {
            router.push("/register")
        }
        return {
            loginForm,
            data,
            loginPasswordForm,
            sendShow,
            sendSmsCode,
            submitLogin,
            qqLogin,
            toRegister
        }
    }
}
</script>

<style scoped>
.container {
    position: relative;
    padding: 10px 35px 0;
}

.title {
    color: rgb(52, 57, 101);
    font-size: 30px;
    font-weight: 700;
    line-height: 44px;
}

.sub-title {
    opacity: 0.5;
    color: rgb(52, 57, 101);
    font-size: 12px;
    line-height: 18px;
}

.form-field {
    background-color: aliceblue;
    margin-bottom: 15px;
}

.form-group {
    margin: 10px 0;
}

.forget-password {
    opacity: 0.5;
    color: rgb(52, 57, 101);
    font-size: 12px;
    line-height: 12px;
    text-align: right;
    margin-top: 10px;
}

.login-button {
    margin-top: 60px;
}

.third-login {
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-qq {
    margin-right: 50px;
}

.no-account {
    color: rgb(52, 57, 101);
    font-size: 12px;
    line-height: 15px;
    text-align: center;
}

.back-png {
    position: absolute;
    top: 40px;
    left: 20px;
    z-index: 1;
}

.frame-png {
    display: block;
    margin: 45px auto 30px;
}

.text {
    color: rgb(6, 2, 32);
    font-size: 23px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
}

.code-text {
    color: rgba(6, 2, 32, 0.6);
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
}

.confirm-code {
    display: block;
    margin: 45px auto 30px;
    width: 70%;
}

.reset-send {
    text-align: right;
    color: red;
}
</style>