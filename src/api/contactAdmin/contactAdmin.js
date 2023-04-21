import request from "../../utils/request";

/**
 * 获取聊天室
 * @returns {AxiosPromise}
 */
export function getChatRoom(adminUuid) {
    return request({
        url: '/contact-admin/get-chatRoom/' + adminUuid,
        method: 'get'
    })
}

/**
 * 获取聊天记录
 * @returns {AxiosPromise}
 */
export function pageHistory(chatRoomUuid) {
    return request({
        url: '/contact-admin/page/history/' + chatRoomUuid,
        method: 'get'
    })
}