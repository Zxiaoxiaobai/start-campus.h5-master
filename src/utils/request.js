import axios from 'axios'
import {getToken} from "./auth";
import {Notify} from "vant";

const service = axios.create({
    baseURL: process.env.VUE_APP_BASEURL
});
service.interceptors.request.use(config => {
    // 判断是否有token
    config.headers['AUTH_TOKEN'] = getToken();
    return config
}, (error) => {
    console.log(error)
});

service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 0) {
            // 参数错误
            if (res.code === 50001) {
                // 主要通知
                Notify({type: 'danger', message: res.msg, duration: 1000});
            }
            // 业务错误
            if (res.code === 50002) {
                // 主要通知
                Notify({type: 'danger', message: res.msg, duration: 1000});
            }
            //认证错误
            if (res.code === 50003) {
                // 主要通知
                Notify({type: 'danger', message: res.msg, duration: 1000});
                setTimeout(function () {
                    window.location.href = '/login'
                }, 2000)
            }
            return Promise.reject()
        } else {
            return res
        }
    },
    error => {
        // 主要通知
        Notify({type: 'primary', message: '请求异常', duration: 1000});
        return Promise.reject(error)
    }
);
export default service