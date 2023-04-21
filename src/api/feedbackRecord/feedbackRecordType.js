import request from "../../utils/request";

/**
 * 获取所有反馈记录类型
 * @returns {AxiosPromise}
 */
export function all() {
    return request({
        url: '/feedback-record-type/all',
        method: 'get'
    })
}