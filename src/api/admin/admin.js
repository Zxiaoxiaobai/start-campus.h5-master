import request from "../../utils/request";

/**
 * 随机获取一名客服管理员
 * @returns {AxiosPromise}
 */
export function randomOne(){
    return request({
        url : '/admin/random-one',
        method : 'get'
    })
}