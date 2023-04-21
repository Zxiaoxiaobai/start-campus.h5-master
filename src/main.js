import {createApp} from 'vue'
import App from './App.vue'
import 'vant/lib/index.css'
import Vant from 'vant'
import {Lazyload} from 'vant';
import './assets/static/icons/iconfont/iconfont.css'
import './assets/static/css/startcampusfont.css'
import './assets/static/icons/iconfont/iconfont.js'
import Router from './router'
import {getToken, getUserInfo, setToken, setUserInfo} from "./utils/auth";
import router from "./router";
import {currentUserInfo} from "@/api/user/user";
import {Toast} from "vant";
import { Dialog } from 'vant';
import { Notify } from 'vant';

createApp(App).use(Vant).use(Router).use(Notify).use(Dialog).use(Lazyload).mount('#app')
router.beforeEach((to, from, next) => {
    // qq登录
    if (to.path.indexOf('/qq') === 0) {
        // 获取到AUTH_TOKEN
        const code = to.path.split("/")[2]
        const AUTH_TOKEN = code.split("=")[1];
        setToken(AUTH_TOKEN);
        Toast.loading({
            duration: 2000,
            message: '登录中...',
            forbidClick: true,
            loadingType: 'spinner',
        });
        // 获取用户信息
        currentUserInfo().then(res => {
            setUserInfo(res.data)
            if (!res.data.isSetBasicMessage) {
                setTimeout(function () {
                    // 跳转到设置基本信息界面
                    next({
                        path: "/user/setBasicMessage",
                    })
                }, 2000)
            } else {
                // 跳转到首页
                setTimeout(function () {
                    next({
                        path: "/"
                    })
                }, 2000)
            }
        })
    } else {
        document.title = to.meta.title || '智慧校园'
        if (to.path === "/login" || to.path === '/register') {
            next();
        } else if (to.path === '/user/setBasicMessage' && getUserInfo() && !getUserInfo().isSetBasicMessage) {
            next()
        } else {
            if (getToken() && getUserInfo() && getUserInfo().isSetBasicMessage) {
                next()
            } else if (getUserInfo() && !getUserInfo().isSetBasicMessage) {
                next({
                    path: "/user/setBasicMessage",
                });
            } else {
                next({
                    path: "/login",
                });
            }
        }
    }
});