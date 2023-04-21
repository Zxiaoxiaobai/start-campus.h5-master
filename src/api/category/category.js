import request from "../../utils/request";

/**
 * 获取某个板块下的所有分类
 * @param param
 * @returns {AxiosPromise}
 */
export function getByPlateUuid(plateUuid) {
    return request({
        url: '/category/get-by-plate/' + plateUuid,
        method: 'get'
    })
}