const tokenKey = "AUTH_TOKEN";
const userInfoKey = "startcampus_client_userinfo";
// 设置token
export function setToken(token) {
    localStorage.setItem(tokenKey, token);
}
// 获取token
export function getToken() {
    return localStorage.getItem(tokenKey);
}
// 删除token
export function removeToken() {
    localStorage.removeItem(tokenKey);
}
// 设置用户信息
export function setUserInfo(userInfo) {
    localStorage.setItem(userInfoKey, JSON.stringify(userInfo));
}
// 获取用户信息
export function getUserInfo() {
    return JSON.parse(localStorage.getItem(userInfoKey));
}
// 删除用户信息
export function removeUserInfo() {
    return localStorage.removeItem(userInfoKey);
}
