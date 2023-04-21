import request from "../../utils/request";

/**
 * 查询圈子排名前十
 * @param param
 * @returns {AxiosPromise}
 */
export function top10() {
    return request({
        url: '/circle/top10',
        method: 'get'
    })
}

/**
 * 关注圈子
 * @returns {AxiosPromise}
 * @param uuid
 */
export function follow(uuid) {
    return request({
        url: '/circle/follow/' + uuid,
        method: 'post'
    })
}

/**
 * 取消关注
 * @returns {AxiosPromise}
 * @param uuid
 */
export function cancelFollow(uuid) {
    return request({
        url: '/circle/cancel-follow/' + uuid,
        method: 'post'
    })
}

/**
 * 分页查询圈子
 * @param param
 * @returns {AxiosPromise}
 */
export function page(param) {
    return request({
        url: '/circle/page',
        method: 'get',
        params: param
    })
}

/**
 * 创建圈子
 * @param param
 * @returns {AxiosPromise}
 */
export function create(param) {
    return request({
        url: '/circle/create',
        method: 'post',
        data: param
    })
}

/**
 * 圈子详情
 * @returns {AxiosPromise}
 * @param uuid
 */
export function detail(uuid) {
    return request({
        url: '/circle/detail/' + uuid,
        method: 'get',
    })
}

/**
 * 获取某个学校全部圈子
 * @returns {AxiosPromise}
 */
export function list() {
    return request({
        url: '/circle/list-by-school',
        method: 'get',
    })
}

/**
 * 分页查询用户关注或创建的圈子
 * @returns {AxiosPromise}
 */
export function page2User(param) {
    return request({
        url: '/circle/page/user',
        method: 'get',
        params: param
    })
}

/**
 * 启用圈子
 * @returns {AxiosPromise}
 */
export function enable(uuid) {
    return request({
        url: '/circle/enable/' + uuid,
        method: 'put',
    })
}

/**
 * 禁用圈子
 * @returns {AxiosPromise}
 */
export function disable(uuid) {
    return request({
        url: '/circle/disable/' + uuid,
        method: 'put',
    })
}

/**
 * 删除圈子
 * @returns {AxiosPromise}
 */
export function deleted(uuid) {
    return request({
        url: '/circle/delete/' + uuid,
        method: 'delete',
    })
}

/**
 * 修改圈子
 * @returns {AxiosPromise}
 */
export function update(param, uuid) {
    return request({
        url: '/circle/update/' + uuid,
        method: 'put',
        data: param
    })
}

