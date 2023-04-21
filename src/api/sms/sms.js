import request from "../../utils/request";

/**
 * 发送验证码
 * @param param
 * @returns {AxiosPromise}
 */
export function sendSms(param) {
    return request({
        url: '/sms/send',
        method: 'post',
        data: param
    })
}