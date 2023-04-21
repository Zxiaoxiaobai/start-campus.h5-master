<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-search v-model="searchParam.title" placeholder="请输入商品标题" @search="onSearch"/>
        <van-pull-refresh v-model="data.refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="data.loading"
                :finished="data.finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-card
                    v-for="commodity in data.commodities" :key="commodity.uuid"
                    :price="commodity.currentPrice"
                    :title="commodity.title"
                    :desc="commodity.publishSchoolName"
                    :thumb="commodity.firstImage"
                    :origin-price="commodity.originalPrice"
                >
                    <template #tag>
                        <van-tag round type="primary" v-show="commodity.status === 1">待审核</van-tag>
                        <van-tag round type="danger" v-show="commodity.status === 2">未通过</van-tag>
                        <van-tag round type="success" v-show="commodity.status === 3">上架</van-tag>
                        <van-tag round type="warning" v-show="commodity.status === 4">下架</van-tag>
                    </template>
                    <template #tags>
                        <van-space>
                            <van-tag round type="success">{{ commodity.categoryName }}</van-tag>
                            <van-tag round type="primary" v-if="commodity.isSyncLibertySquare" color="#7232dd">
                                自由广场
                            </van-tag>
                        </van-space>
                    </template>
                    <template #footer>
                        <van-button size="mini" v-if="commodity.status === 3 && commodity.isSyncLibertySquare"
                                    type="warning"
                                    @click="cancelSyncCommodityLibertySquare(commodity.uuid)">
                            取消同步广场
                        </van-button>
                        <van-button size="mini" v-if="commodity.status === 3 && !commodity.isSyncLibertySquare"
                                    type="success"
                                    @click="syncCommodityLibertySquare(commodity.uuid)">
                            同步广场
                        </van-button>
                        <van-button size="mini" v-if="commodity.status === 2" type="default"
                                    @click="toCommodityEdit(commodity.uuid)">
                            修改
                        </van-button>
                        <van-button size="mini" v-if="commodity.status === 4" type="success"
                                    @click="putCommodity(commodity.uuid)">
                            上架
                        </van-button>
                        <van-button size="mini" v-if="commodity.status === 3" type="warning"
                                    @click="dropCommodity(commodity.uuid)">
                            下架
                        </van-button>
                        <van-button size="mini" type="danger" @click="deleteCommodity(commodity.uuid)">删除</van-button>
                    </template>
                </van-card>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {pageSearchUser, put, drop, deleted, syncLibertySquare, cancelSyncLibertySquare} from "@/api/commodity/commodity";
import {Notify, Dialog} from "vant";
import {useRouter} from "vue-router";
import Navbar from "@/components/navbar/navbar";

export default {
    name: "commodity",
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '我的商品',
            navbarPath: '/user/person',
            loading: true,
            finished: false,
            commodities: [],
            refreshing: false
        })
        const searchParam = reactive({
            page: 0,
            size: 10,
            title: ''
        })
        const router = useRouter();
        /**
         * 获取用户发布的商品
         * @returns {Promise<void>}
         */
        const getUserCommodity = async () => {
            pageSearchUser(searchParam).then(res => {
                const result = res.data.records
                if (result.length < searchParam.size) {
                    data.finished = true
                }
                data.commodities = data.commodities.concat(result)
                data.refreshing = false
            })
        }

        /**
         * 上架商品
         * @param uuid
         * @returns {Promise<void>}
         */
        const putCommodity = async (uuid) => {
            Dialog.confirm({
                title: '上架提示',
                message:
                    '确定要上架该商品吗？',
            })
                .then(() => {
                    put(uuid).then(() => {
                        Notify({type: 'success', message: '上架成功'});
                        data.commodities = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }

        /**
         * 下架商品
         * @param uuid
         * @returns {Promise<void>}
         */
        const dropCommodity = async (uuid) => {
            Dialog.confirm({
                title: '下架提示',
                message:
                    '确定要下架该商品吗？下架后将自动从自由广场取消同步',
            })
                .then(() => {
                    drop(uuid).then(() => {
                        Notify({type: 'success', message: '下架成功'});
                        data.commodities = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });

        }
        /**
         * 删除商品
         * @param uuid
         * @returns {Promise<void>}
         */
        const deleteCommodity = async (uuid) => {
            Dialog.confirm({
                title: '删除提示',
                message:
                    '确定要删除该商品吗？',
            })
                .then(() => {
                    deleted(uuid).then(() => {
                        Notify({type: 'success', message: '删除成功'});
                        data.commodities = []
                        searchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 搜索
         * @returns {Promise<void>}
         */
        const onSearch = () => {
            data.commodities = []
            searchParam.page = 0
            onLoad()
        }
        /**
         * 商品修改
         * @param uuid
         */
        const toCommodityEdit = (uuid) => {
            router.push({path: '/commodity/edit', query: {uuid: uuid}})
        }
        const onLoad = () => {
            searchParam.page++
            getUserCommodity()
        }
        /**
         * 取消同步到自由广场
         * @param uuid
         */
        const cancelSyncCommodityLibertySquare = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要将商品从自由广场取消同步吗？',
            })
                .then(() => {
                    cancelSyncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '取消同步成功', duration: 1000});
                        data.commodities = []
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
                    '确定要将商品同步到自由广场吗？',
            })
                .then(() => {
                    syncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '同步成功', duration: 1000});
                        data.commodities = []
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
            data.commodities = []
            searchParam.page = 0
            onLoad()
        }
        onMounted(() => {
        })
        return {
            data,
            searchParam,
            putCommodity,
            dropCommodity,
            deleteCommodity,
            onSearch,
            toCommodityEdit,
            onLoad,
            cancelSyncCommodityLibertySquare,
            syncCommodityLibertySquare,
            onRefresh
        }
    }
}
</script>

<style scoped>

</style>