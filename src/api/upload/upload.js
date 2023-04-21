import request from "../../utils/request";

/**
 * 上传图片
 * @param param
 * @returns {AxiosPromise}
 */
export function uploadImage(param) {
    return request({
        url: '/common/upload-image',
        method: 'post',
        data: param
    })
}