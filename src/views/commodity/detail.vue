<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell>
            <template #icon>
                <van-image round width="30px" height="30px"  fit="cover" :src="data.publishUserInfo.avatar"/>
            </template>
            <template #title>
                <span
                    style="margin-left: 5px;color: #6B7280;font-size: 15px; display: flex;align-items: center;height: 100%;">{{
                        data.publishUserInfo.nickName
                    }}</span>
            </template>
            <template #right-icon>
                <van-button type="success" icon="plus" size="mini" v-if="!data.isFollowUser" @click="followUser">关注
                </van-button>
                <van-button type="primary" icon="cross" size="mini" v-if="data.isFollowUser" @click="cancelFollowUser">
                    取消关注
                </van-button>
            </template>
        </van-cell>
        <van-cell>
            <template #title>
                <span style="font-weight: bold">{{ data.commodityDetail.title }}</span>
            </template>
        </van-cell>
        <van-cell>
            <template #title>
                <div style="display: flex;align-items: center">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-fenlei"></use>
                    </svg>
                    <span>{{
                            data.commodityDetail.categoryName
                        }}</span>
                </div>
            </template>
            <template #value>
                <van-space :size="1">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-jiage"></use>
                    </svg>
                    <span style="font-weight: bold">￥{{ data.commodityDetail.currentPrice }}</span>
                </van-space>
            </template>
        </van-cell>
        <van-cell :value="data.commodityDetail.description"/>
        <img v-for="(img) in data.commodityDetail.images" v-lazy="img" :key="img"
             style="width: 100%"
             @click="showImage(index,data.commodityDetail.images)"/>
        <div style="height: var(--van-action-bar-height)"></div>
        <van-action-bar>
            <van-action-bar-icon icon="chat-o" text="聊天" @click="toChat"/>
            <van-action-bar-icon icon="phone-o" text="联系" @click="contact" />
            <van-action-bar-button type="success" text="已收藏" v-if="data.isCollectShow"
                                   @click="cancelCollectCommodity"/>
            <van-action-bar-button type="danger" text="收藏" v-if="!data.isCollectShow" @click="collectCommodity"/>
        </van-action-bar>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import {detail, collect, isCollect, cancelCollect} from "@/api/commodity/commodity";
import {getUserInfo} from "@/utils/auth";
import {ImagePreview, Notify} from "vant";
import {follow, cancelFollow, getByUserUuid, isFollow} from "@/api/user/user";
import Navbar from "@/components/navbar/navbar";

export default {
    name: "detail",
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '商品详情',
            navbarPath: '/commodity/index',
            commodityDetail: "",
            userInfo: getUserInfo(),
            isCollectShow: false,
            isFollowUser: false,
            publishUserInfo: ''
        });
        const route = useRoute();
        const router = useRouter();
        const commodityDetail = () => {
            detail(route.query.uuid).then((res) => {
                data.commodityDetail = res.data;
                // 获取发布用户信息
                getUserByUserUuid()
            });
        };
        const onClickLeft = async () => {
            history.back();
        };
        /**
         * 跳转到聊天界面
         * @returns {Promise<void>}
         */
        const toChat = async () => {
            // 判断是否和自己聊天
            if (data.userInfo.uuid === data.commodityDetail.publishUserUuid) {
                Notify({type: "warning", message: "不能和自己聊天哦"});
                return;
            }
            await router.push({
                path: "/chatMessage/chat",
                query: {
                    publishUserUuid: data.commodityDetail.publishUserUuid
                },
            });
        };
        /**
         * 收藏商品
         */
        const collectCommodity = () => {
            collect(route.query.uuid).then(() => {
                Notify({type: "success", message: "收藏成功", duration: 1000});
                data.isCollectShow = true
            })
        }
        /**
         * 取消收藏
         */
        const cancelCollectCommodity = () => {
            cancelCollect(route.query.uuid).then(() => {
                Notify({type: "success", message: "取消成功", duration: 1000});
                data.isCollectShow = false
            })
        }
        /**
         * 关注用户
         */
        const followUser = () => {
            follow(data.commodityDetail.publishUserUuid).then(() => {
                Notify({type: "success", message: "感谢关注", duration: 1000});
                data.isFollowUser = true
            })
        }
        /**
         * 取消关注用户
         */
        const cancelFollowUser = () => {
            cancelFollow(data.commodityDetail.publishUserUuid).then(() => {
                Notify({type: "success", message: "已取消关注", duration: 1000});
                data.isFollowUser = false
            })
        }
        /**
         * 获取发布者用户信息
         */
        const getUserByUserUuid = () => {
            getByUserUuid(data.commodityDetail.publishUserUuid).then(res => {
                data.publishUserInfo = res.data
                // 是否关注
                isFollow(data.publishUserInfo.uuid).then(res => {
                    data.isFollowUser = res.data
                })
            })
        }
        /**
         * 查看图片
         * @param {*} index
         * @param {*} images
         */
        const showImage = (index, images) => {
            ImagePreview({
                images: images,
                showIndex: true,
                loop: false,
                startPosition: index
            })
        }
        /**
         * 拨打联系电话
         */
        const contact = () => {
            window.location.href = 'tel:' + data.commodityDetail.contactPhone;

        }
        onMounted(() => {
            commodityDetail();
            // 是否收藏
            isCollect(route.query.uuid).then(res => {
                data.isCollectShow = res.data
            })
        });
        return {
            data,
            onClickLeft,
            toChat,
            collectCommodity,
            cancelCollectCommodity,
            followUser,
            cancelFollowUser,
            showImage,
            contact
        };
    },
};
</script>

<style scoped>
</style>