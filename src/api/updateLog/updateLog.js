import request from "../../utils/request";

/**
 * 获取最新的更新日志
 * @returns {AxiosPromise}
 */
export function latest() {
    return request({
        url: '/update-log/latest',
        method: 'get',
    })
}

/**
 * 已读最新的更新日志
 * @param uuid
 * @returns {AxiosPromise}
 */
export function read(uuid) {
    return request({
        url: '/update-log/read/' + uuid,
        method: 'put',
    })
}