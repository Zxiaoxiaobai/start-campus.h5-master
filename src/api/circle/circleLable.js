import request from "../../utils/request";

/**
 * 获取圈子标签
 * @param circleUuid
 * @returns {AxiosPromise}
 */
export function list(circleUuid) {
    return request({
        url: '/circle-label/list/' + circleUuid,
        method: 'get'
    })
}