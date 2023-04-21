import request from "../../utils/request";

/**
 * 获取验证码图片
 * @returns {AxiosPromise}
 */
export function generateCaptcha(){
    return request({
        url : '/captcha/generate',
        method : 'get'
    })
}