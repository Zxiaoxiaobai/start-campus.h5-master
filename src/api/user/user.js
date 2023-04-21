import request from "../../utils/request";

/**
 * 用户手机号登录
 * @param param
 * @returns {AxiosPromise}
 */
export function loginByPhone(param) {
    return request({
        url: '/user/login/phone',
        method: 'post',
        data: param
    })
}

/**
 * 当前用户信息
 * @param param
 * @returns {AxiosPromise}
 */
export function currentUserInfo() {
    return request({
        url: '/user/current-user-info',
        method: 'get',
    })
}

/**
 * 用户邮箱注册
 * @param param
 * @returns {AxiosPromise}
 */
export function registerEmail(param) {
    return request({
        url: '/user/register-email',
        method: 'post',
        data: param
    })
}

/**
 * 修改头像
 * @param param
 * @returns {AxiosPromise}
 */
export function updateAvatar(param) {
    return request({
        url: '/user/update-avatar',
        method: 'put',
        data: param
    })
}

/**
 * 修改基本信息
 * @param param
 * @returns {AxiosPromise}
 */
export function updateUserInfo(param) {
    return request({
        url: '/user/update-user-info',
        method: 'put',
        data: param
    })
}

/**
 * 设置基本信息
 * @param param
 * @returns {AxiosPromise}
 */
export function setBasicMessage(param) {
    return request({
        url: '/user/set-basic-message',
        method: 'put',
        data: param
    })
}

/**
 * 修改密码
 * @param param
 * @returns {AxiosPromise}
 */
export function updatePassword(param) {
    return request({
        url: '/user/update-password',
        method: 'post',
        data: param
    })
}

/**
 * 拉起qq登录
 * @param param
 * @returns {AxiosPromise}
 */
export function pullUpQQ() {
    return request({
        url: '/user/login/pull-up-qq',
        method: 'get',
    })
}

/**
 * 根据uuid获取用户信息
 * @returns {AxiosPromise}
 * @param uuid
 */
export function getByUserUuid(uuid) {
    return request({
        url: '/user/get/' + uuid,
        method: 'get',
    })
}

/**
 * 关注用户
 * @returns {AxiosPromise}
 * @param uuid
 */
export function follow(uuid) {
    return request({
        url: '/user/follow/' + uuid,
        method: 'post',
    })
}

/**
 * 取消关注用户
 * @returns {AxiosPromise}
 * @param uuid
 */
export function cancelFollow(uuid) {
    return request({
        url: '/user/cancel-follow/' + uuid,
        method: 'put',
    })
}

/**
 * 是否关注
 * @returns {AxiosPromise}
 * @param uuid
 */
export function isFollow(uuid) {
    return request({
        url: '/user/is-follow/' + uuid,
        method: 'get',
    })
}

/**
 * 分页查询关注用户
 * @returns {AxiosPromise}
 * @param param
 */
export function pageFollow(param) {
    return request({
        url: '/user/page/follow',
        method: 'get',
        params: param
    })
}

/**
 * 修改背景图
 * @returns {AxiosPromise}
 * @param param
 */
export function updateBackgroundImage(param) {
    return request({
        url: '/user/update/background-image',
        method: 'put',
        data: param
    })
}

/**
 * 修改手机号
 * @returns {AxiosPromise}
 * @param param
 */
export function updatePhone(param) {
    return request({
        url: '/user/update-phone',
        method: 'put',
        data: param
    })
}

/**
 * 密码登录
 * @param param
 * @returns {AxiosPromise}
 */
export function loginByPassword(param) {
    return request({
        url: '/user/login/password',
        method: 'post',
        data: param
    })
}

/**
 * 用户手动注册
 * @param param
 * @returns {AxiosPromise}
 */
export function manualRegister(param) {
    return request({
        url: '/user/manual-register',
        method: 'post',
        data: param
    })
}

/**
 * 分页查询粉丝
 * @returns {AxiosPromise}
 * @param param
 */
export function pageFan(param) {
    return request({
        url: '/user/page/fan',
        method: 'get',
        params: param
    })
}
