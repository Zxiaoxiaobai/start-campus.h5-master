import request from "../../utils/request";

/**
 * 表白墙评论
 * @param param
 * @returns {AxiosPromise}
 */
export function add(param, uuid) {
    return request({
        url: '/confessional-wall-comment/add/' + uuid,
        method: 'post',
        data: param
    })
}

/**
 * 分页获取表白墙父级评论
 * @param param
 * @returns {AxiosPromise}
 */
export function pageParentComment(searchParam, uuid) {
    return request({
        url: '/confessional-wall-comment/page/parent-comment/' + uuid,
        method: 'get',
        params: searchParam
    })
}

/**
 * 表白墙回复
 * @param param
 * @param confessionalWallCommentUuid
 * @returns {AxiosPromise}
 */
export function reply(param, confessionalWallCommentUuid) {
    return request({
        url: '/confessional-wall-comment/reply/' + confessionalWallCommentUuid,
        method: 'post',
        data: param
    })
}

/**
 * 分页查询该评论下子集评论
 * @param param
 * @returns {AxiosPromise}
 */
export function pageChildrenComment(searchParam, uuid) {
    return request({
        url: '/confessional-wall-comment/page/children-comment/' + uuid,
        method: 'get',
        params: searchParam
    })
}

/**
 * 删除评论
 * @param uuid
 * @returns {AxiosPromise}
 */
export function deleted(uuid) {
    return request({
        url: '/confessional-wall-comment/delete/' + uuid,
        method: 'delete',
    })
}