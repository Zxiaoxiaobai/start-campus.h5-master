import request from "../../utils/request";

/**
 * 获取全部学校
 * @param param
 * @returns {AxiosPromise}
 */
export function all() {
    return request({
        url: '/school/all',
        method: 'get',
    })
}