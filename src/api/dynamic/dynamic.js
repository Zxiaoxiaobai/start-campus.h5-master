import request from "../../utils/request";

/**
 * 发布悄悄话
 * @param param
 * @returns {AxiosPromise}
 */
export function publishWhisper(param) {
    return request({
        url: '/dynamic/publish-whisper',
        method: 'post',
        data: param
    })
}

/**
 * 分页获取动态
 * @param param
 * @returns {AxiosPromise}
 */
export function page(param) {
    return request({
        url: '/dynamic/page',
        method: 'get',
        params: param
    })
}

/**
 * 动态详情
 * @param uuid
 * @returns {AxiosPromise}
 */
export function detail(uuid) {
    return request({
        url: '/dynamic/detail/' + uuid,
        method: 'get',
    })
}

/**
 * 分页获取用户发布的动态
 * @param param
 * @returns {AxiosPromise}
 */
export function page2User(param) {
    return request({
        url: '/dynamic/page/user',
        method: 'get',
        params: param
    })
}

/**
 * 删除动态
 * @param uuid
 * @returns {AxiosPromise}
 */
export function deleted(uuid) {
    return request({
        url: '/dynamic/delete/' + uuid,
        method: 'delete',
    })
}

/**
 * 根据圈子获取圈子下的动态
 * @param param
 * @param circleUuid
 * @returns {AxiosPromise}
 */
export function pageByCircleUuid(param, circleUuid) {
    return request({
        url: '/dynamic/page-by-circle-uuid/' + circleUuid,
        method: 'get',
        params: param
    })
}

/**
 * 开启评论
 * @param uuid
 * @returns {AxiosPromise}
 */
export function openComment(uuid) {
    return request({
        url: '/dynamic/open-comment/' + uuid,
        method: 'put',
    })
}

/**
 * 关闭评论
 * @param uuid
 * @returns {AxiosPromise}
 */
export function closeComment(uuid) {
    return request({
        url: '/dynamic/close-comment/' + uuid,
        method: 'put',
    })
}

/**
 * 修改悄悄话
 * @param uuid
 * @returns {AxiosPromise}
 */
export function updateWhisper(param, uuid) {
    return request({
        url: '/dynamic/update-whisper/' + uuid,
        method: 'put',
        data: param
    })
}

/**
 * 显示
 * @param uuid
 * @returns {AxiosPromise}
 */
export function display(uuid) {
    return request({
        url: '/dynamic/display/' + uuid,
        method: 'put',
    })
}

/**
 * 隐藏
 * @param uuid
 * @returns {AxiosPromise}
 */
export function hide(uuid) {
    return request({
        url: '/dynamic/hide/' + uuid,
        method: 'put',
    })
}

/**
 * 同步自由广场
 * @param param
 * @param uuid
 * @returns {AxiosPromise}
 */
export function syncLibertySquare(uuid) {
    return request({
        url: '/dynamic/sync-liberty-square/' + uuid,
        method: 'put',
    })
}

/**
 * 取消同步自由广场
 * @param param
 * @param uuid
 * @returns {AxiosPromise}
 */
export function cancelSyncLibertySquare(uuid) {
    return request({
        url: '/dynamic/cancel-sync-liberty-square/' + uuid,
        method: 'put',
    })
}

/**
 * 是否点赞
 * @param uuid
 * @returns {AxiosPromise}
 */
export function isKudos(uuid) {
    return request({
        url: '/dynamic/is-kudos/' + uuid,
        method: 'get'
    })
}

/**
 * 动态点赞
 * @param param
 * @returns {AxiosPromise}
 */
export function kudos(uuid) {
    return request({
        url: '/dynamic/kudos/' + uuid,
        method: 'post'
    })
}

/**
 * 动态取消点赞
 * @param param
 * @returns {AxiosPromise}
 */
export function cancelKudos(uuid) {
    return request({
        url: '/dynamic/cancel-kudos/' + uuid,
        method: 'post'
    })
}


