import request from "../../utils/request";

/**
 * 分页查询头条新闻
 * @param param
 * @returns {AxiosPromise}
 */
export function page(param,type) {
    return request({
        url: '/headline-news/page/' + type,
        method: 'get',
        params: param
    })
}

/**
 * 头条新闻详情
 * @param uuid
 * @returns {AxiosPromise}
 */
export function detail(uuid) {
    return request({
        url: '/headline-news/detail/' + uuid,
        method: 'get',
    })
}