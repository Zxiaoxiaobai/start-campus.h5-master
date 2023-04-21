import request from "../../utils/request";

/**
 * 获取全部板块
 * @param param
 * @returns {AxiosPromise}
 */
export function all() {
    return request({
        url: '/plate/all',
        method: 'get',
    })
}