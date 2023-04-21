import request from "../../utils/request";

/**
 * 添加评论
 * @param param
 * @returns {AxiosPromise}
 */
export function add(param) {
    return request({
        url: '/lost-found-item-comment/add',
        method: 'post',
        data: param
    })
}

/**
 * 分页查询某个物品的评论
 * @param param
 * @returns {AxiosPromise}
 */
export function page(lostFoundItemUuid, searchParam) {
    return request({
        url: '/lost-found-item-comment/page/' + lostFoundItemUuid,
        method: 'get',
        params: searchParam
    })
}