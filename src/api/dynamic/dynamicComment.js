import request from "../../utils/request";

/**
 * 动态评论
 * @param param
 * @param uuid
 * @returns {AxiosPromise}
 */
export function add(param, uuid) {
    return request({
        url: '/dynamic-comment/add/' + uuid,
        method: 'post',
        data: param
    })
}

/**
 * 分页获取动态父级评论
 * @param searchParam
 * @param uuid
 * @returns {AxiosPromise}
 */
export function pageParentComment(searchParam, uuid) {
    return request({
        url: '/dynamic-comment/page/parent-comment/' + uuid,
        method: 'get',
        params: searchParam
    })
}

/**
 * 动态回复
 * @param param
 * @param dynamicCommentUuid
 * @returns {AxiosPromise}
 */
export function reply(param, dynamicCommentUuid) {
    return request({
        url: '/dynamic-comment/reply/' + dynamicCommentUuid,
        method: 'post',
        data: param
    })
}

/**
 * 分页查询该评论下子集评论
 * @param searchParam
 * @param uuid
 * @returns {AxiosPromise}
 */
export function pageChildrenComment(searchParam, uuid) {
    return request({
        url: '/dynamic-comment/page/children-comment/' + uuid,
        method: 'get',
        params: searchParam
    })
}