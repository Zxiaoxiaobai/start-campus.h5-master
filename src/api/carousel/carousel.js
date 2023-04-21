import request from "../../utils/request";

/**
 * 获取全部启用轮播图
 * @returns {AxiosPromise}
 */
export function listAllEnable() {
    return request({
        url: '/carousel/list-all-enable',
        method: 'get'
    })
}