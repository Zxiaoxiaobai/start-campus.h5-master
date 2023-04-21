import request from "../../utils/request";

/**
 * 发布物品
 * @param param
 * @returns {AxiosPromise}
 */
export function publish(param) {
    return request({
        url: '/lost-found-item/publish',
        method: 'post',
        data: param
    })
}

/**
 * 分页查询物品
 * @param param
 * @returns {AxiosPromise}
 */
export function page(param) {
    return request({
        url: '/lost-found-item/page',
        method: 'get',
        params: param
    })
}

/**
 * 分页查询用户物品
 * @param param
 * @returns {AxiosPromise}
 */
 export function pageToUser(param) {
    return request({
        url: '/lost-found-item/page/user',
        method: 'get',
        params: param
    })
}

/**
 * 物品详情
 * @param param
 * @returns {AxiosPromise}
 */
export function detail(uuid) {
    return request({
        url: '/lost-found-item/detail/' + uuid,
        method: 'get',
    })
}

/**
 * 删除物品
 * @param uuid
 * @returns {AxiosPromise}
 */
export function deleted(uuid) {
    return request({
        url: '/lost-found-item/delete/' + uuid,
        method: 'delete'
    })
}

/**
 * 确认认领物品
 * @param uuid
 * @returns {AxiosPromise}
 */
 export function confirmClaim(uuid) {
    return request({
        url: '/lost-found-item/confirm-claim/' + uuid,
        method: 'put'
    })
}

/**
 * 确认找到物品
 * @param uuid
 * @returns {AxiosPromise}
 */
 export function confirmFind(uuid) {
    return request({
        url: '/lost-found-item/confirm-find/' + uuid,
        method: 'put'
    })
}

/**
 * 重新发布物品
 * @param uuid
 * @returns {AxiosPromise}
 */
export function reissue(uuid) {
    return request({
        url: '/lost-found-item/reissue/' + uuid,
        method: 'post'
    })
}

/**
 * 物品修改
 * @param param
 * @param uuid
 * @returns {AxiosPromise}
 */
export function edit(param,uuid) {
    return request({
        url: '/lost-found-item/edit/' + uuid,
        method: 'put',
        data: param
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
        url: '/lost-found-item/sync-liberty-square/' + uuid,
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
        url: '/lost-found-item/cancel-sync-liberty-square/' + uuid,
        method: 'put',
    })
}

/**
 * 撤回物品
 * @param uuid
 * @returns {AxiosPromise}
 */
export function revoke(uuid) {
    return request({
        url: '/lost-found-item/revoke/' + uuid,
        method: 'put',
    })
}