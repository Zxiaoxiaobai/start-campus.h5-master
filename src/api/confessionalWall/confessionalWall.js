import request from "../../utils/request";

/**
 * 发布表白墙
 * @param param
 * @returns {AxiosPromise}
 */
export function publish(param) {
    return request({
        url: '/confessional-wall/publish',
        method: 'post',
        data: param
    })
}

/**
 * 分页查询表白墙
 * @param param
 * @returns {AxiosPromise}
 */
export function page(param) {
    return request({
        url: '/confessional-wall/page',
        method: 'get',
        params: param
    })
}

/**
 * 表白墙详情
 * @param param
 * @returns {AxiosPromise}
 */
export function detail(uuid) {
    return request({
        url: '/confessional-wall/detail/' + uuid,
        method: 'get'
    })
}

/**
 * 是否点赞
 * @param param
 * @returns {AxiosPromise}
 */
export function isKudos(uuid) {
    return request({
        url: '/confessional-wall/is-kudos/' + uuid,
        method: 'get'
    })
}

/**
 * 表白墙点赞
 * @param param
 * @returns {AxiosPromise}
 */
export function kudos(uuid) {
    return request({
        url: '/confessional-wall/kudos/' + uuid,
        method: 'post'
    })
}

/**
 * 表白墙取消点赞
 * @param param
 * @returns {AxiosPromise}
 */
export function cancelKudos(uuid) {
    return request({
        url: '/confessional-wall/cancel-kudos/' + uuid,
        method: 'post'
    })
}

/**
 * 分页查询用户表白墙
 * @param param
 * @returns {AxiosPromise}
 */
export function page2User(param) {
    return request({
        url: '/confessional-wall/page/user',
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
        url: '/confessional-wall/open-comment/' + uuid,
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
        url: '/confessional-wall/close-comment/' + uuid,
        method: 'put',
    })
}

/**
 * 删除表白墙
 * @param uuid
 * @returns {AxiosPromise}
 */
export function deleted(uuid) {
    return request({
        url: '/confessional-wall/delete/' + uuid,
        method: 'delete',
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
        url: '/confessional-wall/sync-liberty-square/' + uuid,
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
        url: '/confessional-wall/cancel-sync-liberty-square/' + uuid,
        method: 'put',
    })
}