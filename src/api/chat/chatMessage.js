import request from "../../utils/request";

/**
 * 分页获取和某人的历史聊天记录
 * @param param
 * @returns {AxiosPromise}
 */
export function pageHistory(param) {
    return request({
        url: '/chat-message/page/history',
        method: 'get',
        params: param
    })
}

/**
 * 分页获取聊天列表
 * @param param
 * @returns {AxiosPromise}
 */
export function pageListChatMessage(param) {
    return request({
        url: '/chat-message/page/list',
        method: 'get',
        params: param
    })
}

/**
 * 是否存在未读消息
 * @param param
 * @returns {AxiosPromise}
 */
 export function isExitsNoReadChatMessage() {
    return request({
        url: '/chat-message/is-exits-no-read',
        method: 'get'
    })
}