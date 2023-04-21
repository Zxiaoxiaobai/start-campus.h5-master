<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell value="在这里你可以得到很多消息，严格遵守树洞规则"/>
        <van-cell title="推荐圈子" is-link value="圈子广场" @click="toCircleSquare"/>
        <van-cell v-for="circle in data.circles" :key="circle.uuid">
            <template #title>
                <span @click="toCircleDetail(circle.uuid)">{{ circle.title }}</span>
            </template>
            <template #label>
                <span @click="toCircleDetail(circle.uuid)">{{ circle.description }}</span>
            </template>
            <template #icon>
                <van-image round width="50" height="50"
                           :src="circle.avatar"
                           style="margin-right:10px" @click="toCircleDetail(circle.uuid)"/>
            </template>
            <template #right-icon>
                <van-button type="primary" icon="plus" size="mini" @click="followCircle(circle.uuid)"
                            v-if="!circle.isFollow">关注
                </van-button>
                <van-button type="success" size="mini" @click="cancelFollowCircle(circle.uuid)" v-if="circle.isFollow">
                    取消关注
                </van-button>
            </template>
        </van-cell>
        <van-tabs v-model:active="data.active" shrink @click-tab="onClickTab">
            <van-tab title="new">
                <template #title>
                    最新
                </template>
            </van-tab>
            <van-tab title="hot">
                <template #title>
                    最热
                </template>
            </van-tab>
            <van-pull-refresh v-model="data.refreshing" @refresh="onRefresh">
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
                                           fit="cover"
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
                                    <van-image width="100" height="100" v-for="(image,index) in dynamic.images"
                                               :key="image"
                                               fit="cover"
                                               :src="image" @click="showImage(index,dynamic.images)"/>
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
            </van-pull-refresh>
        </van-tabs>
        <div class="button">
            <van-popover v-model:show="showPopover" :actions="actions" placement="left" @select="onSelect">
                <template #reference>
                    <van-button round type="primary" icon="plus" size="small">发布</van-button>
                </template>
            </van-popover>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted, ref} from 'vue'
import {top10, follow, cancelFollow} from '@/api/circle/circle'
import {ImagePreview, Notify} from 'vant';
import {useRouter} from "vue-router";
import {page} from "@/api/dynamic/dynamic";
import commonUtil from "@/utils/common";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '树洞',
            navbarPath: '/',
            circles: [],
            dynamics: [],
            loading: false,
            finished: false,
            refreshing: false
        })
        const router = useRouter()
        const showPopover = ref(false);
        const actions = [
            {text: '悄悄话'},
            {text: '写问答'},
        ];
        const dynamicSearchParam = reactive({
            page: 0,
            size: 10,
            orderType: "new"
        })
        /**
         * 查询圈子排名前十
         */
        const top10Circle = () => {
            top10().then(res => {
                data.circles = res.data
            })
        }
        /**
         * 关注圈子
         * @param {*} uuid
         */
        const followCircle = (uuid) => {
            follow(uuid).then(() => {
                Notify({type: 'success', message: '感谢关注'});
                top10Circle()
            })
        }
        /**
         * 取消关注
         * @param {*} uuid
         */
        const cancelFollowCircle = (uuid) => {
            cancelFollow(uuid).then(() => {
                Notify({type: 'success', message: '取消成功'});
                top10Circle()
            })
        }
        /**
         * 跳转到圈子广场
         */
        const toCircleSquare = () => {
            router.push("/treeHole/circleSquare")
        }
        /**
         * 跳转到圈子详情
         * @param uuid
         */
        const toCircleDetail = (uuid) => {
            router.push({path: '/treeHole/circle/detail', query: {uuid: uuid}})
        }
        const onSelect = (action) => {
            if (action.text === '悄悄话') {
                // 跳转到发布悄悄话界面
                router.push("/treeHole/publishWhisper")
            }
        }
        /**
         * 分页查询动态
         */
        const pageSearchDynamic = () => {
            page(dynamicSearchParam).then(res => {
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
                data.refreshing = false
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
            if (event.title === 'new') {
                dynamicSearchParam.orderType = 'new'
                onLoad()
            }
            if (event.title === 'hot') {
                dynamicSearchParam.orderType = 'hot'
                onLoad()
            }
        }
        /**
         * 下拉刷新
         */
        const onRefresh = () => {
            data.dynamics = []
            dynamicSearchParam.page = 0
            onLoad()
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
            top10Circle()
        })
        return {
            data,
            showPopover,
            actions,
            followCircle,
            cancelFollowCircle,
            toCircleSquare,
            toCircleDetail,
            onSelect,
            onLoad,
            toDynamicDetail,
            onClickTab,
            onRefresh,
            showImage
        }
    }
}
</script>

<style>
.button {
    position: fixed;
    bottom: 80px;
    right: 10px;
}

.content {
    display: -webkit-box; /*设置为弹性盒子*/
    -webkit-line-clamp: 5; /*最多显示5行*/
    overflow: hidden; /*超出隐藏*/
    text-overflow: ellipsis; /*超出显示为省略号*/
    -webkit-box-orient: vertical;
    word-break: break-all; /*强制英文单词自动换行*/
}
</style>
