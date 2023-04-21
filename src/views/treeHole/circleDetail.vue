<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-image class="info-cover"
                   :src="data.circleDetail.avatar"></van-image>
        <div class="u-flex-wrap"
             style="padding-top: 9px;padding-bottom: 9px;position: relative;align-items: center;display: flex;flex-direction: row;justify-content: flex-end;">
            <div class="info-avatar">
                <van-image round style="height: 100%; width: 100%"
                           :src="data.circleDetail.avatar" fit="cover"></van-image>
            </div>
            <div style="margin-right: 10px;">
                <van-button type="primary" icon="plus" size="mini" @click="followCircle(data.circleDetail.uuid)"
                            v-if="!data.circleDetail.isFollow">关注
                </van-button>
                <van-button type="success" size="mini" @click="cancelFollowCircle(data.circleDetail.uuid)"
                            v-if="data.circleDetail.isFollow">
                    取消关注
                </van-button>
            </div>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30px;">
            <span style="font-size: 16px;color: #111111;font-weight: bold;margin-right: 10px;">
                {{ data.circleDetail.title }}
            </span>
        </div>
        <div style="font-size: 12px;color: #555555;margin:10px 30px;">
            <span style="margin-right: 20px;">{{ data.circleDetail.description }}</span>
        </div>
        <div style="display: flex;align-items: center;margin-left: 30px;margin-top: 5px;margin-bottom: 5px;">
            <span
                style="font-size: 16px;font-weight: bold;color: #555555;margin-right: 9px;">{{
                    data.circleDetail.followCount
                }}</span>
            <span style="font-size: 12px;color: gray;margin-right: 14px;">粉丝</span>
            <span
                style="font-size: 16px;font-weight: bold;color: #555555;margin-right: 9px;">{{
                    data.circleDetail.dynamicCount
                }}</span>
            <span style="font-size: 12px;color: gray;margin-right: 14px;">动态</span>
        </div>
        <div>
            <van-tabs v-model:active="data.active" @click-tab="onClickTab">
                <van-tab name="new">
                    <template #title>
                        最新
                    </template>
                </van-tab>
                <van-tab name="hot">
                    <template #title>
                        最热
                    </template>
                </van-tab>
                <van-list
                    v-model:loading="data.loading"
                    :finished="data.finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <van-card
                        v-for="dynamic in data.dynamics"
                        :key="dynamic.uuid">
                        <template #title>
                            <div style="display: flex;align-items: center;">
                                <van-image round width="20" height="20"
                                           :src="dynamic.publishUserAvatar" style="margin-right: 5px"/>
                                <span>{{ dynamic.publishUserNickName }}</span>
                            </div>
                        </template>
                        <template #desc>
                            <van-space direction="vertical">
                                <div style="margin-top: 10px" class="content" @click="toDynamicDetail(dynamic.uuid)">
                                    {{ dynamic.content }}
                                </div>
                                <div>
                                    <van-space wrap>
                                        <van-image width="100" height="100" v-for="(image,index) in dynamic.images"
                                                   :key="image"
                                                   :src="image" @click="showImage(index,dynamic.images)" fit="cover"/>
                                    </van-space>
                                </div>
                            </van-space>
                        </template>
                        <template #price>
                            <van-space style="margin-top: 20px" :size="10">
                                <van-icon name="chat"/>
                                <span>{{ dynamic.commentCount }}</span>
                                <van-icon name="eye"/>
                                <span>{{ dynamic.viewCount }}</span>
                                <van-icon name="thumb-circle"/>
                                <span>{{ dynamic.kudosCount }}</span>
                                <van-icon name="clock"/>
                                <span>{{ dynamic.createTime }}</span>
                            </van-space>
                        </template>
                        <template #tags>
                            <div>
                                <van-tag plain type="success" style="margin-right: 5px">{{ dynamic.typeName }}
                                </van-tag>
                                <van-tag plain color="#7232dd" style="margin-right: 5px">{{
                                        dynamic.publishCircleTitle
                                    }}
                                </van-tag>
                                <van-tag plain type="primary" v-for="label in dynamic.labels" :key="label"
                                         style="margin-right: 5px;margin-top: 10px">{{ label }}
                                </van-tag>
                            </div>
                        </template>
                    </van-card>
                </van-list>
            </van-tabs>
        </div>
        <div>
        </div>
    </div>
</template>

<script>
import {getUserInfo} from "@/utils/auth";
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import {cancelFollow, detail, follow} from "@/api/circle/circle";
import {ImagePreview, Notify} from "vant";
import {pageByCircleUuid} from "@/api/dynamic/dynamic";
import commonUtil from "@/utils/common";
import {useRouter} from "vue-router";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const route = useRoute();
        const router = useRouter();
        const data = reactive({
            navbarTitle: '圈子详情',
            navbarPath: '/treeHole/index',
            userInfo: getUserInfo(),
            circleUuid: route.query.uuid,
            circleDetail: '',
            loading: false,
            finished: false,
            dynamics: [],
            active: 0
        })
        const dynamicSearchParam = reactive({
            page: 0,
            size: 10,
            orderType: 'new'
        })
        /**
         * 圈子详情
         */
        const getCircleDetail = () => {
            detail(data.circleUuid).then(res => {
                data.circleDetail = res.data
            })
        }
        /**
         * 关注圈子
         * @param {*} uuid
         */
        const followCircle = (uuid) => {
            follow(uuid).then(() => {
                Notify({type: 'success', message: '感谢关注', duration: 1000});
                data.circleDetail.isFollow = true
            })
        }
        /**
         * 取消关注
         * @param {*} uuid
         */
        const cancelFollowCircle = (uuid) => {
            cancelFollow(uuid).then(() => {
                Notify({type: 'success', message: '取消成功', duration: 1000});
                data.circleDetail.isFollow = false
            })
        }
        const pageSearchDynamic = () => {
            pageByCircleUuid(dynamicSearchParam, route.query.uuid).then(res => {
                const result = res.data.records
                if (result.length < dynamicSearchParam.size) {
                    data.finished = true
                }
                result.forEach(item => {
                    const dynamicType = commonUtil.dynamicType.find(type => {
                        return type.value === item.type
                    })
                    item.typeName = dynamicType.text
                })
                data.dynamics = data.dynamics.concat(res.data.records)
            })
        }
        const onLoad = () => {
            dynamicSearchParam.page++
            pageSearchDynamic()
        }
        /**
         * 动态详情
         * @param uuid
         */
        const toDynamicDetail = (uuid) => {
            router.push({path: "/treeHole/dynamicDetail", query: {uuid: uuid}})
        }
        /**
         * 切换标签
         * @param event
         */
        const onClickTab = (event) => {
            data.dynamics = []
            dynamicSearchParam.page = 0
            if (event.name === 'new') {
                dynamicSearchParam.orderType = 'new'
                onLoad()
            }
            if (event.name === 'hot') {
                dynamicSearchParam.orderType = 'hot'
                onLoad()
            }
        }
        const showImage = (index, images) => {
            ImagePreview({
                images: images,
                showIndex: true,
                loop: false,
                startPosition: index
            })
        }
        onMounted(() => {
            getCircleDetail()
        })
        return {
            data,
            followCircle,
            cancelFollowCircle,
            onLoad,
            toDynamicDetail,
            onClickTab,
            showImage
        }
    }
}
</script>
<style>
.info-cover {
    display: block;
    width: auto;
    height: 250px;
}

.info-avatar {
    position: absolute;
    left: 30px;
    top: -25px;
    width: 4rem;
    height: 4rem;
}
</style>