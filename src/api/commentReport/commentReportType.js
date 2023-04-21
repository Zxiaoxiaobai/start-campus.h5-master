import request from "../../utils/request";

/**
 * 获取全部评论举报类型
 * @param param
 * @returns {AxiosPromise}
 */
export function list() {
    return request({
        url: '/comment-report-type/list',
        method: 'get'
    })
}