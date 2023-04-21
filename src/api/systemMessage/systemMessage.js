import request from "../../utils/request";

/**
 * 分页查询系统消息
 * @param param
 * @returns {AxiosPromise}
 */
export function page(param) {
    return request({
        url: '/system-message/page',
        method: 'get',
        params: param
    })
}

/**
 * 单个消息已读
 * @returns {AxiosPromise}
 * @param uuid
 */
export function singleRead(uuid) {
    return request({
        url: '/system-message/single-read/' + uuid,
        method: 'post'
    })
}

/**
 * 全部消息已读
 * @returns {AxiosPromise}
 */
export function allRead() {
    return request({
        url: '/system-message/all-read',
        method: 'post'
    })
}

/**
 * 是否存在未读消息
 * @param param
 * @returns {AxiosPromise}
 */
export function isExitsNoReadSystemMessage() {
    return request({
        url: '/system-message/is-exits-no-read',
        method: 'get'
    })
}

/**
 * 删除系统消息
 * @param uuid
 * @returns {AxiosPromise}
 */
export function deleted(uuid) {
    return request({
        url: '/system-message/delete/' + uuid,
        method: 'delete'
    })
}