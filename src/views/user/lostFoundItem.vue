<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-search v-model="searchParam.name" placeholder="请输入物品名称" @search="onSearch"/>
        <van-dropdown-menu>
            <van-dropdown-item v-model="searchParam.publishType" :options="publishTypes" :title="data.publishTypeTitle"
                               @change="changePublishType"/>
            <van-dropdown-item v-model="searchParam.orderType" :options="orderTypes" :title="data.orderTitle"
                               @change="changeOrderType"/>
        </van-dropdown-menu>
        <van-pull-refresh v-model="data.refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="data.loading"
                :finished="data.finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-card
                    v-for="lostFoundItem in data.lostFoundItems" :key="lostFoundItem.uuid"
                    :title="lostFoundItem.name"
                    :thumb="lostFoundItem.firstImage"
                    :desc="lostFoundItem.description"
                >
                    <template #tag>
                        <van-tag round type="primary" v-if="lostFoundItem.status === 1">待审核</van-tag>
                        <van-tag round type="danger" v-if="lostFoundItem.status === 2">未通过</van-tag>
                        <van-tag round type="warning" v-if="lostFoundItem.status === 3">未认领</van-tag>
                        <van-tag round type="success" v-if="lostFoundItem.status === 4">已认领</van-tag>
                        <van-tag round type="warning" v-if="lostFoundItem.status === 5">未找到</van-tag>
                        <van-tag round type="success" v-if="lostFoundItem.status === 6">已找到</van-tag>
                        <van-tag round type="danger" v-if="lostFoundItem.status === 7">已撤回</van-tag>
                    </template>
                    <template #tags>
                        <van-space :size="5">
                            <van-icon name="user-o"/>
                            <span>{{ lostFoundItem.publishNickName }}</span>
                            <van-icon name="clock-o"/>
                            <span>{{ lostFoundItem.createTime }}</span>
                        </van-space>
                    </template>
                    <template #price>
                        <van-space style="margin-bottom: 10px">
                            <van-tag round type="success" v-if="lostFoundItem.type === 1">拾取物品</van-tag>
                            <van-tag round type="success" v-if="lostFoundItem.type === 2">丢失物品</van-tag>
                            <van-tag round type="primary" v-if="lostFoundItem.isSyncLibertySquare" color="#7232dd">
                                自由广场
                            </van-tag>
                        </van-space>
                    </template>
                    <template #footer>
                        <van-space :size="3">
                            <van-button size="mini" type="success" v-if="lostFoundItem.status === 3"
                                        @click="confirmClaimLostFoundItem(lostFoundItem.uuid)">确认认领
                            </van-button>
                            <van-button size="mini" type="success" v-if="lostFoundItem.status === 5"
                                        @click="confirmFindLostFoundItem(lostFoundItem.uuid)">确认找到
                            </van-button>
                            <van-button size="mini" type="success" v-if="lostFoundItem.status === 7"
                                        @click="reissueFindLostFoundItem(lostFoundItem.uuid)">重发
                            </van-button>
                            <van-button size="mini" type="warning"
                                        v-if="lostFoundItem.status === 3 || lostFoundItem.status === 5"
                                        @click="revokeLostFoundItem(lostFoundItem.uuid)">撤回
                            </van-button>
                            <van-button size="mini"
                                        v-if="(lostFoundItem.status === 3 || lostFoundItem.status === 5) && lostFoundItem.isSyncLibertySquare"
                                        type="warning"
                                        @click="cancelSyncCommodityLibertySquare(lostFoundItem.uuid)">
                                取消同步广场
                            </van-button>
                            <van-button size="mini"
                                        v-if="(lostFoundItem.status === 3 || lostFoundItem.status === 5) && !lostFoundItem.isSyncLibertySquare"
                                        type="success"
                                        @click="syncCommodityLibertySquare(lostFoundItem.uuid)">
                                同步广场
                            </van-button>
                            <van-button size="mini" v-if="lostFoundItem.status === 2"
                                        @click="toLostFoundItemEdit(lostFoundItem.uuid)">编辑
                            </van-button>
                            <van-button size="mini" @click="toLostFoundItemDetail(lostFoundItem.uuid)">详情</van-button>
                            <van-button size="mini" type="danger" @click="deleteLostFoundItem(lostFoundItem.uuid)">删除
                            </van-button>
                        </van-space>
                    </template>
                </van-card>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {
    pageToUser,
    deleted,
    confirmClaim,
    confirmFind,
    reissue,
    syncLibertySquare,
    cancelSyncLibertySquare,
    revoke
} from "@/api/lostFoundItem/lostFoundItem";
import {useRouter} from 'vue-router'
import {Dialog, Notify} from "vant";
import Navbar from "@/components/navbar/navbar";

export default {
    name: "lostFoundItem",
    components: {Navbar},
    setup() {
        const searchParam = reactive({
            page: 0,
            size: 10,
            name: '',
            publishType: 0,
            orderType: 'default'
        })
        const publishTypes = [
            {text: '全部', value: 0},
            {text: '拾取物品', value: 1},
            {text: '丢失物品', value: 2},
        ];
        const orderTypes = [
            {text: '默认排序', value: 'default'},
            {text: '时间降序', value: 'timeDesc'},
            {text: '时间升序', value: 'timeAsc'},
        ];
        const data = reactive({
            navbarTitle: '我的失物招领',
            navbarPath: '/user/person',
            publishTypeTitle: '',
            lostFoundItems: [],
            loading: false,
            finished: false,
            refreshing: false,
        })
        const router = useRouter();
        const pageSearch = () => {
            pageToUser(searchParam).then(res => {
                const result = res.data.records
                if (result.length < searchParam.size) {
                    data.finished = true
                }
                data.lostFoundItems = data.lostFoundItems.concat(result)
                data.refreshing = false
            })
        }
        const changePublishType = (value) => {
            data.lostFoundItems = []
            searchParam.page = 0
            searchParam.publishType = value
            const result = publishTypes.filter((publishType) => {
                return publishType.value === value
            })
            data.publishTypeTitle = result[0].text
            onLoad()
        }
        /**
         * 按照排序查询
         * @returns {Promise<void>}
         */
        const changeOrderType = (value) => {
            data.lostFoundItems = []
            searchParam.page = 0
            searchParam.orderType = value
            const result = orderTypes.filter((orderType) => {
                return orderType.value === value
            })
            data.orderTitle = result[0].text
            onLoad()
        }
        /**
         * 搜索
         * @returns {Promise<void>}
         */
        const onSearch = () => {
            data.lostFoundItems = []
            searchParam.page = 0
            onLoad()
        }
        /**
         * 跳转到物品详情
         * @param uuid
         * @returns {Promise<void>}
         */
        const toLostFoundItemDetail = async (uuid) => {
            await router.push({path: "/lostFoundItem/detail", query: {uuid: uuid}})
        }
        /**
         * 删除物品
         * @param uuid
         * @returns {Promise<void>}
         */
        const deleteLostFoundItem = async (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要删除该物品吗？',
            })
                .then(() => {
                    deleted(uuid).then(() => {
                        Notify({type: 'success', message: '删除成功'});
                        data.lostFoundItems = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 确认认领
         * @param {*} uuid
         */
        const confirmClaimLostFoundItem = async (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定该物品已被认领了吗？',
            })
                .then(() => {
                    confirmClaim(uuid).then(() => {
                        Notify({type: 'success', message: '认领成功'});
                        data.lostFoundItems = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }

        /**
         * 确认找到
         * @param {*} uuid
         */
        const confirmFindLostFoundItem = async (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定该物品已被找到了吗？',
            })
                .then(() => {
                    confirmFind(uuid).then(() => {
                        Notify({type: 'success', message: '找到成功'});
                        data.lostFoundItems = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 重新发布失物招领
         * @param uuid
         */
        const reissueFindLostFoundItem = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定该物品重新发布吗？',
            })
                .then(() => {
                    reissue(uuid).then(() => {
                        Notify({type: 'success', message: '发布成功'});
                        data.lostFoundItems = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 跳转到编辑页面
         * @param uuid
         */
        const toLostFoundItemEdit = (uuid) => {
            router.push({path: "/lostFoundItem/edit", query: {uuid: uuid}})
        }
        /**
         * 取消同步到自由广场
         * @param uuid
         */
        const cancelSyncCommodityLibertySquare = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要将物品从自由广场取消同步吗？',
            })
                .then(() => {
                    cancelSyncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '取消同步成功', duration: 1000});
                        data.lostFoundItems = []
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
                    '确定要将物品同步到自由广场吗？',
            })
                .then(() => {
                    syncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '同步成功', duration: 1000});
                        data.lostFoundItems = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 滚动加载
         */
        const onLoad = () => {
            searchParam.page++
            pageSearch()
        }
        /**
         * 撤回失物招领
         * @param uuid
         */
        const revokeLostFoundItem = (uuid) => {
            Dialog.confirm({
                title: '撤回提示',
                message:
                    '确定要将物品撤回吗？',
            })
                .then(() => {
                    revoke(uuid).then(() => {
                        Notify({type: 'success', message: '撤回成功', duration: 1000});
                        data.lostFoundItems = []
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
            data.lostFoundItems = []
            searchParam.page = 0
            onLoad()
        }
        onMounted(() => {
        })
        return {
            data,
            searchParam,
            publishTypes,
            orderTypes,
            changePublishType,
            changeOrderType,
            onSearch,
            toLostFoundItemDetail,
            deleteLostFoundItem,
            confirmClaimLostFoundItem,
            confirmFindLostFoundItem,
            reissueFindLostFoundItem,
            toLostFoundItemEdit,
            cancelSyncCommodityLibertySquare,
            syncCommodityLibertySquare,
            onLoad,
            revokeLostFoundItem,
            onRefresh
        }
    }
}
</script>

<style scoped>

</style>