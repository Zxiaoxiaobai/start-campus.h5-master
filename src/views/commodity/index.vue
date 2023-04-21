<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <form action="">
            <van-search v-model="searchParam.title" placeholder="请输入商品标题" @search="onSearch" show-action/>
        </form>
        <van-dropdown-menu>
            <van-dropdown-item v-model="searchParam.categoryUuid" :options="data.categories" :title="data.categoryTitle"
                               @change="changeCategory"/>
            <van-dropdown-item v-model="searchParam.orderType" :options="orderTypes" :title="data.orderTitle"
                               @change="changeOrderType"/>
            <van-dropdown-item :title="data.priceTitle" ref="item">
                <van-space wrap style="margin-top: 10px">
                    <van-button round :type="data.priceActive === 0 ? 'primary' : 'default'" size="small" block
                                @click="selectPrice(0)">全部
                    </van-button>
                    <van-button round :type="data.priceActive === 1 ? 'primary' : 'default'" size="small" block
                                @click="selectPrice(1)">0～50
                    </van-button>
                    <van-button round :type="data.priceActive === 2 ? 'primary' : 'default'" size="small" block
                                @click="selectPrice(2)">50～100
                    </van-button>
                    <van-button round :type="data.priceActive === 3 ? 'primary' : 'default'" size="small" block
                                @click="selectPrice(3)">100～500
                    </van-button>
                    <van-button round :type="data.priceActive === 4 ? 'primary' : 'default'" size="small" block
                                @click="selectPrice(4)">500+
                    </van-button>
                </van-space>
            </van-dropdown-item>
        </van-dropdown-menu>
        <van-pull-refresh v-model="data.refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="data.loading"
                :finished="data.finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <van-card
                    v-for="commodity in data.commodities" :key="commodity.uuid"
                    :price="commodity.currentPrice + '.00'"
                    :title="commodity.title"
                    :thumb="commodity.firstImage"
                    :origin-price="commodity.originalPrice + '.00'"
                    :desc="commodity.description"
                >
                    <template #tag>
                        <van-tag round type="success">{{ commodity.categoryName }}</van-tag>
                    </template>
                    <template #tags>
                        <van-space :size="5">
                            <van-icon name="user-o"/>
                            <span>{{ commodity.publishUserName }}</span>
                            <van-icon name="clock-o"/>
                            <span>{{ commodity.createTime }}</span>
                        </van-space>
                    </template>
                    <template #footer>
                        <van-button size="small" @click="toCommodityDetail(commodity.uuid)">查看详情</van-button>
                    </template>
                </van-card>
            </van-list>
        </van-pull-refresh>
        <div class="publish">
            <van-button round type="primary" icon="plus" size="small" @click="toCommodityPublish">发布</van-button>
        </div>
    </div>
</template>

<script>
import {pageSearch} from "@/api/commodity/commodity";
import {all} from "@/api/plate/plate";
import {getByPlateUuid} from "@/api/category/category";
import {onMounted, reactive, ref} from "vue";
import {useRouter} from 'vue-router'
import Navbar from "@/components/navbar/navbar";

export default {
    name: "index",
    components: {Navbar},
    setup() {
        const searchParam = reactive({
            page: 0,
            size: 10,
            categoryUuid: 'all',
            orderType: 'default',
            title: '',
            priceRegion: 0
        })
        const data = reactive({
            navbarTitle: '闲置商品',
            navbarPath: '/',
            commodities: [],
            loading: true,
            finished: false,
            active: 0,
            categories: [],
            categoryTitle: '全部分类',
            orderTitle: '排序',
            priceTitle: '价格',
            priceActive: 0,
            refreshing: false
        })
        const orderTypes = [
            {text: '默认排序', value: 'default'},
            {text: '时间降序', value: 'timeDesc'},
            {text: '时间升序', value: 'timeAsc'},
        ];
        const priceRegion = [
            {text: '全部', value: 0},
            {text: '0～50', value: 1},
            {text: '50～100', value: 2},
            {text: '100-500', value: 3},
            {text: '500+', value: 4},
        ];
        const router = useRouter();
        const item = ref(null);
        /**
         * 分页查询商品
         * @returns {Promise<void>}
         */
        const pageSearchCommodity = async () => {
            pageSearch(searchParam).then(res => {
                const result = res.data.records
                if (result.length < searchParam.size) {
                    data.finished = true
                }
                data.refreshing = false
                data.commodities = data.commodities.concat(result)
            })
        }
        /**
         * 跳转到详情页面
         * @param uuid
         * @returns {Promise<void>}
         */
        const toCommodityDetail = async (uuid) => {
            await router.push({path: "/commodity/detail", query: {uuid: uuid}})
        }
        /**
         * 获取全部板块
         * @returns {Promise<void>}
         */
        const allPlate = async () => {
            all().then(res => {
                const plate = res.data.filter((plate) => {
                    return plate.code === 'commodity'
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
         * 按分类查询
         * @param value
         * @returns {Promise<void>}
         */
        const changeCategory = (value) => {
            data.commodities = []
            searchParam.categoryUuid = value
            searchParam.page = 0
            const result = data.categories.filter((category) => {
                return category.value === value
            })
            data.categoryTitle = result[0].text
            onLoad()
        }

        /**
         * 按照排序查询
         * @returns {Promise<void>}
         */
        const changeOrderType = (value) => {
            data.commodities = []
            searchParam.orderType = value
            searchParam.page = 0
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
            data.commodities = []
            searchParam.page = 0
            onLoad()
        }
        /**
         * 跳转到发布商品页面
         * @returns {Promise<void>}
         */
        const toCommodityPublish = () => {
            router.push("/commodity/publish")
        }
        /**
         * 价格选择
         * @param index
         * @returns {Promise<void>}
         */
        const selectPrice = (index) => {
            data.commodities = []
            searchParam.page = 0
            const price = priceRegion.filter((price) => {
                return price.value === index
            })
            data.priceActive = index;
            data.priceTitle = price[0].text
            searchParam.priceRegion = price[0].value
            item.value.toggle();
            onLoad()
        }
        /**
         * 滚动加载闲置商品
         */
        const onLoad = () => {
            searchParam.page++
            pageSearchCommodity()
        }
        /**
         * 下拉刷新闲置商品
         */
        const onRefresh = () => {
            data.commodities = []
            searchParam.page = 0
            data.finished = false
            onLoad()
        }
        onMounted(() => {
            allPlate()
        })
        return {
            searchParam,
            data,
            orderTypes,
            item,
            toCommodityDetail,
            changeCategory,
            changeOrderType,
            onSearch,
            toCommodityPublish,
            selectPrice,
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