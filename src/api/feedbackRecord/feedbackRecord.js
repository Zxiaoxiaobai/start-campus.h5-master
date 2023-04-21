import request from "../../utils/request";

/**
 * 新增反馈
 * @returns {AxiosPromise}
 */
export function add(param) {
    return request({
        url: '/feedback-record/add',
        method: 'post',
        data: param
    })
}