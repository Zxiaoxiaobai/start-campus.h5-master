<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-pull-refresh v-model="data.refreshing" @refresh="onRefresh">
            <van-list v-model="data.loading" :finished="data.finished" finished-text="没有更多了"
                      @load="onLoad">
                <van-card v-for="confessionalWall in data.confessionalWalls" :key="confessionalWall.uuid">
                    <template #title>
                        <van-cell :border="false">
                            <template #value>
                                <div @click="toConfessionalWallDetail(confessionalWall.uuid)">
                                    {{ confessionalWall.content }}
                                </div>
                            </template>
                        </van-cell>
                    </template>
                    <template #desc>
                        <van-cell :border="false">
                            <template #value>
                                <van-image width="100" height="100" v-for="(image,index) in confessionalWall.images"
                                           :key="image"
                                           :src="image" @click="showImage(index,confessionalWall.images)"/>
                            </template>
                        </van-cell>
                    </template>
                    <template #footer>
                        <van-button size="mini" v-if="!confessionalWall.isSyncLibertySquare" type="success"
                                    @click="syncCommodityLibertySquare(confessionalWall.uuid)">
                            同步广场
                        </van-button>
                        <van-button size="mini" v-if="confessionalWall.isSyncLibertySquare" type="warning"
                                    @click="cancelSyncCommodityLibertySquare(confessionalWall.uuid)">
                            取消同步广场
                        </van-button>
                        <van-button size="mini" v-if="!confessionalWall.isOpenComment" type="success"
                                    @click="open(confessionalWall)">
                            开启评论
                        </van-button>
                        <van-button size="mini" v-if="confessionalWall.isOpenComment" type="warning"
                                    @click="close(confessionalWall)">
                            关闭评论
                        </van-button>
                        <van-button size="mini" type="danger" @click="deleteConfessionalWall(confessionalWall.uuid)">
                            删除
                        </van-button>
                    </template>
                </van-card>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script>
import {
    closeComment,
    openComment,
    page2User,
    deleted,
    syncLibertySquare,
    cancelSyncLibertySquare
} from "@/api/confessionalWall/confessionalWall";
import {reactive} from "vue";
import {ImagePreview, Dialog, Notify} from "vant";
import {useRouter} from "vue-router";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '我的表白',
            navbarPath: '/user/person',
            confessionalWalls: [],
            loading: false,
            finished: false,
            refreshing: false
        })
        const searchParam = {
            page: 0,
            size: 10,
            orderType: 'default'
        }
        const router = useRouter()
        /**
         * 分页查询用户表白墙
         */
        const pageSearchUserConfessionalWall = () => {
            page2User(searchParam).then(res => {
                if (res.data.records || res.data.records.length < searchParam.size) {
                    data.finished = true
                }
                data.confessionalWalls = data.confessionalWalls.concat(res.data.records);
                data.refreshing = false
            })
        }
        /**
         * 加载
         */
        const onLoad = () => {
            searchParam.page++
            pageSearchUserConfessionalWall()
        }
        const showImage = (index, images) => {
            ImagePreview({
                images: images,
                showIndex: true,
                loop: false,
                startPosition: index
            })
        }
        /**
         * 开启评论
         */
        const open = (confessionalWall) => {
            Dialog.confirm({
                title: '开启评论',
                message:
                    '你确定要开启该表白墙的评论吗？',
            })
                .then(() => {
                    openComment(confessionalWall.uuid).then(() => {
                        Notify({type: 'success', message: '开启成功', duration: 1000});
                        confessionalWall.isOpenComment = true
                    })
                })
                .catch(() => {

                });
        }
        /**
         * 关闭评论
         */
        const close = (confessionalWall) => {
            Dialog.confirm({
                title: '关闭评论',
                message:
                    '你确定要关闭该表白墙的评论吗？',
            })
                .then(() => {
                    closeComment(confessionalWall.uuid).then(() => {
                        Notify({type: 'success', message: '关闭成功', duration: 1000});
                        confessionalWall.isOpenComment = false
                    })
                })
                .catch(() => {

                });
        }
        /**
         * 跳转到详情页面
         * @param {} uuid
         */
        const toConfessionalWallDetail = (uuid) => {
            router.push({path: '/confessionalWall/detail', query: {uuid: uuid}})
        }
        /**
         * 删除表白墙
         * @param uuid
         */
        const deleteConfessionalWall = (uuid) => {
            Dialog.confirm({
                title: '删除',
                message:
                    '你确定要删除该表白墙吗？',
            })
                .then(() => {
                    deleted(uuid).then(() => {
                        Notify({type: 'success', message: '删除成功', duration: 1000});
                        searchParam.page = 0;
                        data.confessionalWalls = []
                        data.finished = false
                        onLoad();
                    })
                })
                .catch(() => {

                });
        }
        /**
         * 取消同步到自由广场
         * @param uuid
         */
        const cancelSyncCommodityLibertySquare = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要将表白墙从自由广场取消同步吗？',
            })
                .then(() => {
                    cancelSyncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '取消同步成功', duration: 1000});
                        data.confessionalWalls = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 同步到自由广场
         * @param uuid
         */
        const syncCommodityLibertySquare = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要将表白墙同步到自由广场吗？',
            })
                .then(() => {
                    syncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '同步成功', duration: 1000});
                        data.confessionalWalls = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 下拉刷新
         */
        const onRefresh = () => {
            data.confessionalWalls = []
            searchParam.page = 0
            onLoad()
        }
        return {
            data,
            onLoad,
            showImage,
            open,
            close,
            toConfessionalWallDetail,
            deleteConfessionalWall,
            cancelSyncCommodityLibertySquare,
            syncCommodityLibertySquare,
            onRefresh
        }
    }
}
</script>
<style>
.content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
</style>