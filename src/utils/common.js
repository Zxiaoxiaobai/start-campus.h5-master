const generateRequestId = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid
}
const toHHmmss = function (data) {
    var date = new Date(data * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}
/**
 * 聊天消息类型
 * @type {[{text: string, value: number},{text: string, value: number}]}
 */
const chatMessageType = [
    {
        text: '失物招领',
        value: 1
    },
    {
        text: '商品',
        value: 2
    }
]
/**
 * 系统消息类型
 * @type {[{text: string, value: number},{text: string, value: number}]}
 */
const
    systemMessageType = [
        {
            text: '失物招领审核',
            value: 1
        },
        {
            text: '商品审核',
            value: 2
        },
        {
            text: '关注用户',
            value: 3
        },
        {
            text: '商品下架',
            value: 4
        },
        {
            text: '圈子审核',
            value: 5
        },
        {
            text: '动态审核',
            value: 6
        },
        {
            text: '评论举报',
            value: 11
        },
        {
            text: '重置密码',
            value: 12,
        },
        {
            text: '信息清空',
            value: 13
        },
        {
            text: '表白墙审核',
            value: 14
        }
    ]

/**
 * 动态类型
 * @type {[{text: string, value: number},{text: string, value: number}]}
 */
const dynamicType = [
    {
        text: '悄悄话',
        value: 1
    },
    {
        text: '提问',
        value: 2
    }
]
module.exports = {
    generateRequestId,
    toHHmmss,
    chatMessageType,
    systemMessageType,
    dynamicType
}