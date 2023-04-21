import request from "../../utils/request";

/**
 * 新增举报
 * @param param
 * @returns {AxiosPromise}
 */
export function add(param) {
    return request({
        url: '/comment-report/add',
        method: 'post',
        data: param
    })
}