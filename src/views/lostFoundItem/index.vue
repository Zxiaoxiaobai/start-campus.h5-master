<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <form action="">
            <van-search v-model="searchParam.name" placeholder="请输入物品名称" @search="onSearch" show-action/>
        </form>
        <van-dropdown-menu>
            <van-dropdown-item v-model="searchParam.categoryUuid" :options="data.categories" :title="data.categoryTitle"
                               @change="changeCategory"/>
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
                        <van-tag round type="warning" v-if="lostFoundItem.status === 3">未认领</van-tag>
                        <van-tag round type="danger" v-if="lostFoundItem.status === 5">未找到</van-tag>
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
                        <van-space :size="3">
                            <van-tag round type="success" v-if="lostFoundItem.type === 1">拾取物品</van-tag>
                            <van-tag round type="success" v-if="lostFoundItem.type === 2">丢失物品</van-tag>
                            <van-tag round color="#7232dd">{{ lostFoundItem.categoryName }}</van-tag>
                        </van-space>
                    </template>
                    <template #footer>
                        <van-button size="small" @click="toLostFoundItemDetail(lostFoundItem.uuid)">查看详情
                        </van-button>
                    </template>
                </van-card>
            </van-list>
        </van-pull-refresh>
        <div class="publish">
            <van-button round type="primary" icon="plus" size="small" @click="toLostFoundItemPublish">发布</van-button>
        </div>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {useRouter} from 'vue-router'
import {page} from "@/api/lostFoundItem/lostFoundItem";
import {all} from "@/api/plate/plate";
import {getByPlateUuid} from "@/api/category/category";
import Navbar from "@/components/navbar/navbar";

export default {
    name: "index",
    components: {Navbar},
    setup() {
        const searchParam = reactive({
            page: 0,
            size: 10,
            name: '',
            publishType: 0,
            orderType: 'default',
            categoryUuid: 'all'
        })
        const router = useRouter();
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
            navbarTitle: '失物招领',
            navbarPath: '/',
            publishTypeTitle: '发布类型',
            lostFoundItems: [],
            loading: true,
            finished: false,
            categories: [],
            refreshing: false,
        })
        /**
         * 跳转到发布页面
         * @returns {Promise<void>}
         */
        const toLostFoundItemPublish = async () => {
            await router.push("/lostFoundItem/publish")
        }
        /**
         * 根据发布类型查询
         * @param value
         * @returns {Promise<void>}
         */
        const changePublishType = async (value) => {
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
        const changeOrderType = async (value) => {
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
         * 分页查询失物招领
         */
        const pageSearch = () => {
            page(searchParam).then(res => {
                const result = res.data.records
                if (result.length < searchParam.size) {
                    data.finished = true
                }
                data.lostFoundItems = data.lostFoundItems.concat(result)
                data.refreshing = false
            })
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
         * 搜索
         * @returns {Promise<void>}
         */
        const onSearch = async () => {
            data.lostFoundItems = []
            searchParam.page = 0
            onLoad()
        }
        /**
         * 获取全部板块
         * @returns {Promise<void>}
         */
        const allPlate = async () => {
            all().then(res => {
                const plate = res.data.filter((plate) => {
                    return plate.code === 'lostFoundItem'
                });
                data.plateName = plate[0].name
                data.plateUuid = plate[0].uuid
                // 根据板块获取分类
                getByPlateUuid((data.plateUuid)).then(res => {
                    const categoryDatas = []
                    res.data.forEach(category => {
                        categoryDatas.push({
                            value: category.uuid,
                            text: category.name
                        })
                    });
                    categoryDatas.unshift({
                        value: 'all',
                        text: '全部分类'
                    })
                    data.categories = categoryDatas
                })
            })
        }
        /**
         * 选择分类搜索
         * @param value
         */
        const changeCategory = (value) => {
            data.lostFoundItems = []
            searchParam.categoryUuid = value
            searchParam.page = 0
            const result = data.categories.filter((category) => {
                return category.value === value
            })
            data.categoryTitle = result[0].text
            onLoad()
        }
        /**
         * 滚动加载失物招领
         */
        const onLoad = () => {
            searchParam.page++
            pageSearch()
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
            allPlate()
        })
        return {
            searchParam,
            publishTypes,
            orderTypes,
            data,
            toLostFoundItemPublish,
            changePublishType,
            changeOrderType,
            toLostFoundItemDetail,
            onSearch,
            changeCategory,
            onLoad,
            onRefresh
        }
    }
}
</script>

<style scoped>
.publish {
    position: fixed;
    bottom: 80px;
    right: 10px;
}
</style>