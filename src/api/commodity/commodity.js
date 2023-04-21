import request from "../../utils/request";

/**
 * 分页查询商品
 * @param param
 * @returns {AxiosPromise}
 */
export function pageSearch(param) {
    return request({
        url: '/commodity/page-search',
        method: 'get',
        params: param
    })
}

/**
 * 获取商品详情
 * @param uuid
 * @returns {AxiosPromise}
 */
export function detail(uuid) {
    return request({
        url: '/commodity/detail/' + uuid,
        method: 'get',
    })
}

/**
 * 商品发布
 * @param param
 * @returns {AxiosPromise}
 */
export function publish(param) {
    return request({
        url: '/commodity/publish',
        method: 'post',
        data: param
    })
}

/**
 * 分页查询当前用户发布的商品
 * @param param
 */
export function pageSearchUser(param) {
    return request({
        url: '/commodity/page-search/user',
        method: 'get',
        params: param
    })
}

/**
 * 上架商品
 * @param commodityUuid
 */
export function put(commodityUuid) {
    return request({
        url: '/commodity/put/' + commodityUuid,
        method: 'put'
    })
}

/**
 * 下架商品
 * @param commodityUuid
 */
export function drop(commodityUuid) {
    return request({
        url: '/commodity/drop/' + commodityUuid,
        method: 'put'
    })
}

/**
 * 删除商品
 * @param commodityUuid
 */
export function deleted(commodityUuid) {
    return request({
        url: '/commodity/delete/' + commodityUuid,
        method: 'delete'
    })
}

/**
 * 收藏商品
 * @param commodityUuid
 */
export function collect(commodityUuid) {
    return request({
        url: '/commodity/collect/' + commodityUuid,
        method: 'post'
    })
}

/**
 * 是否收藏
 * @param commodityUuid
 */
export function isCollect(commodityUuid) {
    return request({
        url: '/commodity/is-collect/' + commodityUuid,
        method: 'get'
    })
}

/**
 * 取消收藏
 * @param commodityUuid
 */
export function cancelCollect(commodityUuid) {
    return request({
        url: '/commodity/cancel-collect/' + commodityUuid,
        method: 'put'
    })
}

/**
 * 商品修改
 * @param param
 * @param uuid
 * @returns {AxiosPromise}
 */
export function edit(param, uuid) {
    return request({
        url: '/commodity/edit/' + uuid,
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
        url: '/commodity/sync-liberty-square/' + uuid,
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
        url: '/commodity/cancel-sync-liberty-square/' + uuid,
        method: 'put',
    })
}