import request from "../../utils/request";

/**
 * 发送邮箱验证码
 * @param param
 * @returns {AxiosPromise}
 */
export function sendEmailCode(param) {
    return request({
        url: '/email/send-code',
        method: 'post',
        data: param
    })
}