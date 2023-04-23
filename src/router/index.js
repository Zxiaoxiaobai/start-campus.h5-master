import {createRouter, createWebHistory} from "vue-router";

const routes = [
    /******************************************************************首页*********************************************/
    // 首页
    {
        path: '/',
        name: 'index',
        meta: {title: '首页'},
        component: () => import("../views/index"),
    },
    /******************************************************************登录注册*********************************************/
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {title: '登录'},
        component: () => import("../views/login"),
    },
    // 注册
    {
        path: '/register',
        name: 'register',
        meta: {title: '注册'},
        component: () => import("../views/register"),
    },
    /******************************************************************闲置商品*********************************************/
    // 商品详情
    {
        path: '/commodity/detail',
        name: 'commodityDetail',
        meta: {title: '商品详情'},
        component: () => import("../views/commodity/detail"),
    },
    // 商品发布
    {
        path: '/commodity/publish',
        name: 'commodityPublish',
        meta: {title: '商品发布'},
        component: () => import("../views/commodity/publish"),
    },
    // 商品首页
    {
        path: '/commodity/index',
        name: 'commodityIndex',
        meta: {title: '商品首页'},
        component: () => import("../views/commodity/index"),
    },
    // 商品修改
    {
        path: '/commodity/edit',
        name: 'commodityEdit',
        meta: {title: '商品修改'},
        component: () => import("../views/commodity/edit"),
    },
    /******************************************************************个人中心*********************************************/
    // 用户个人中心
    {
        path: '/user/person',
        name: 'person',
        meta: {title: '个人中心'},
        component: () => import("../views/user/personal"),
    },
    // 用户设置
    {
        path: '/user/set',
        name: 'set',
        meta: {title: '设置'},
        component: () => import("../views/user/set"),
    },
    // 用户商品
    {
        path: '/user/commodity',
        name: 'userCommodity',
        meta: {title: '我的商品'},
        component: () => import("../views/user/commodity"),
    },
    // 用户反馈
    {
        path: '/user/feedback',
        name: 'userFeedback',
        meta: {title: '我要反馈'},
        component: () => import("../views/user/feedback"),
    },
    // 用户失物招领
    {
        path: '/user/lostFoundItem',
        name: 'userLostFoundItem',
        meta: {title: '我的失物招领'},
        component: () => import("../views/user/lostFoundItem"),
    },
    // 用户基本信息
    {
        path: '/user/basic',
        name: 'userBasic',
        meta: {title: '基本信息'},
        component: () => import("../views/user/basic"),
    },
    // 用户设置基本信息
    {
        path: '/user/setBasicMessage',
        name: 'userSetBasicMessage',
        meta: {title: '设置信息'},
        component: () => import("../views/user/setBasicMessage"),
    },
    // 用户修改密码
    {
        path: '/user/updatePassword',
        name: 'userUpdatePassword',
        meta: {title: '修改密码'},
        component: () => import("../views/user/updatePassword"),
    },
    // 用户修改手机号
    {
        path: '/user/updatePhone',
        name: 'userUpdatePhone',
        meta: {title: '修改手机号'},
        component: () => import("../views/user/updatePhone"),
    },
    // 用户表白墙
    {
        path: '/user/confessionalWall',
        name: 'userConfessionalWall',
        meta: {title: '我的表白'},
        component: () => import("../views/user/confessionalWall"),
    },
    // 用户动态
    {
        path: '/user/dynamic',
        name: 'userDynamic',
        meta: {title: '我的动态'},
        component: () => import("../views/user/dynamic"),
    },
    // 我的圈子
    {
        path: '/user/circle',
        name: 'userCircle',
        meta: {title: '我的圈子'},
        component: () => import("../views/user/circle"),
    },
    // 联系管理员
    {
        path: '/user/contactAdmin',
        name: 'userContactAdmin',
        meta: {title: '联系管理员'},
        component: () => import("../views/user/contact-admin"),
    },
    /******************************************************************关注信息*********************************************/
    // 关注列表
    {
        path: '/user/follow',
        name: 'userFollow',
        meta: {title: '关注列表'},
        component: () => import("../views/user/follow"),
    },
    {
        path: '/user/fan',
        name: 'userFan',
        meta: {title: '粉丝列表'},
        component: () => import("../views/user/fan"),
    },
    /******************************************************************失物招领*********************************************/
    // 失物招领首页
    {
        path: '/lostFoundItem/index',
        name: 'lostFoundItemIndex',
        meta: {title: '失物招领'},
        component: () => import("../views/lostFoundItem/index"),
    },
    // 失物招领发布
    {
        path: '/lostFoundItem/publish',
        name: 'lostFoundItemPublish',
        meta: {title: '失物招领发布'},
        component: () => import("../views/lostFoundItem/publish"),
    },
    // 失物招领详情
    {
        path: '/lostFoundItem/detail',
        name: 'lostFoundItemDetail',
        meta: {title: '失物招领详情'},
        component: () => import("../views/lostFoundItem/detail"),
    },
    // 失物招领编辑
    {
        path: '/lostFoundItem/edit',
        name: 'lostFoundItemEdit',
        meta: {title: '失物招领编辑'},
        component: () => import("../views/lostFoundItem/edit"),
    },
    /******************************************************************聊天*********************************************/
    // 聊天首页
    {
        path: '/chatMessage/index',
        name: 'chatMessageIndex',
        component: () => import("../views/chatMessage/index"),
    },
    // 聊天列表
    {
        path: '/chatMessage/chat',
        name: 'chatMessageChat',
        component: () => import("../views/chatMessage/chat"),
    },
    /******************************************************************表白墙*********************************************/
    // 表白墙发布页面
    {
        path: '/confessionalWall/publish',
        name: 'confessionalWallPublish',
        meta: {title: '表白墙发布'},
        component: () => import("../views/confessionalWall/publish"),
    },
    // 表白墙首页
    {
        path: '/confessionalWall/index',
        name: 'confessionalWallIndex',
        meta: {title: '表白墙'},
        component: () => import("../views/confessionalWall/index"),
    },
    // 表白墙详情
    {
        path: '/confessionalWall/detail',
        name: 'confessionalWallDetail',
        meta: {title: '表白墙详情'},
        component: () => import("../views/confessionalWall/detail"),
    },
    /******************************************************************树洞*********************************************/
    // 树洞首页
    {
        path: '/treeHole/index',
        name: 'treeHoleIndex',
        meta: {title: '树洞'},
        component: () => import("../views/treeHole/index"),
    },
    // 圈子广场
    {
        path: '/treeHole/circleSquare',
        name: 'treeHoleCircleSquare',
        meta: {title: '圈子广场'},
        component: () => import("../views/treeHole/circleSquare"),
    },
    // 创建圈子
    {
        path: '/treeHole/createCircle',
        name: 'treeHoleCreateCircle',
        meta: {title: '创建圈子'},
        component: () => import("../views/treeHole/createCircle"),
    },
    // 圈子详情
    {
        path: '/treeHole/circle/detail',
        name: 'treeHoleCircleDetail',
        meta: {title: '圈子详情'},
        component: () => import("../views/treeHole/circleDetail"),
    },
    // 修改圈子
    {
        path: '/treeHole/circle/edit',
        name: 'treeHoleEditCircle',
        meta: {title: '修改圈子'},
        component: () => import("../views/treeHole/editCircle"),
    },
    // 发布悄悄话
    {
        path: '/treeHole/publishWhisper',
        name: 'treeHolePublishWhisper',
        meta: {title: '发布悄悄话'},
        component: () => import("../views/treeHole/publishWhisper"),
    },
    // 动态详情
    {
        path: '/treeHole/dynamicDetail',
        name: 'treeHoleDynamicDetail',
        meta: {title: '动态详情'},
        component: () => import("../views/treeHole/dynamicDetail"),
    },
    // 编辑悄悄话
    {
        path: '/treeHole/whisperEdit',
        name: 'treeHoleWhisperEdit',
        meta: {title: '编辑悄悄话'},
        component: () => import("../views/treeHole/whisperEdit"),
    },
    //chatgpt首页
    {
        path: '/chatGpt/index',
        name: 'chatGptIndex',
        meta: {title: 'chatGpt助手'},
        component: () => import("../views/chatGpt/index"),
    },
    {
        path: '/chatGpt/ChatGpt',
        name: 'ChatGpt',
        meta: {title: 'chatGpt窗口'},
        component: () => import("../views/chatGpt/ChatGpt"),
    },
    /**************************************************************评论举报**********************************************/
    {
        path: '/commentReport',
        name: 'commentReportIndex',
        meta: {title: '评论举报'},
        component: () => import("../views/commentReport/index"),
    },

    /*************************************************************头条新闻***********************************************/
    {
        path: '/headlineNews/index',
        name: 'headlineNewsIndex',
        meta: {title: '头条新闻首页'},
        component: () => import("../views/headlineNews/index"),
    },
    {
        path: '/headlineNews/detail',
        name: 'headlineNewsDetail',
        meta: {title: '头条新闻详情'},
        component: () => import("../views/headlineNews/detail"),
    },
]
//根据路由规则创建路由
const router = createRouter({
    history: createWebHistory("/"),
    routes,
});
export default router;
