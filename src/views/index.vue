<template>
    <div>
        <van-cell-group>
            <van-cell :title="data.userInfo.schoolName" icon="location-o">
            </van-cell>
        </van-cell-group>
        <van-swipe :autoplay="3000" lazy-render>
            <van-swipe-item v-for="carousel in data.carousels" :key="carousel.uuid">
                <van-image :src="carousel.url" width="100%" height="300px" fit="cover"/>
            </van-swipe-item>
        </van-swipe>
        <van-nav-bar left-text="校园生活" right-text="更多>"/>
        <van-grid :gutter="5">
            <van-grid-item icon="bag-o" text="闲置商品" @click="toCommodityIndex">
                <template #icon>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shangpin1"></use>
                    </svg>
                </template>
            </van-grid-item>
            <van-grid-item icon="like-o" text="表白墙" @click="toConfessionalWallIndex">
                <template #icon>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-biaobaiqiang"></use>
                    </svg>
                </template>
            </van-grid-item>
            <van-grid-item icon="records" text="失物招领" @click="toLostFoundItem">
                <template #icon>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shiwuzhaoling"></use>
                    </svg>
                </template>
            </van-grid-item>
            <van-grid-item icon="envelop-o" text="帖子论坛" @click="toTreeHole">
                <template #icon>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-luntan"></use>
                    </svg>
                </template>
            </van-grid-item>
        </van-grid>
        <van-nav-bar left-text="新闻服务"/>
        <van-grid>
            <van-grid-item icon="envelop-o" text="头条新闻" @click="toHeadlineNewsIndex">
                <template #icon>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-toutiaoyaowen"></use>
                    </svg>
                </template>
            </van-grid-item>
        </van-grid>
        <tabbar-index :active-index="0"/>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {useRouter} from 'vue-router'
import {Dialog, Notify} from 'vant';
import TabbarIndex from "@/components/tabbar/tabbarIndex";
import {getUserInfo} from "@/utils/auth";
import {latest, read} from "@/api/updateLog/updateLog";
import {listAllEnable} from "@/api/carousel/carousel";

export default {
    name: "index",
    components: {TabbarIndex},
    setup() {
        const data = reactive({
            loading: false,
            finished: false,
            active: 0,
            show: false,
            userInfo: getUserInfo(),
            isReadLatestUpdateLog: false,
            carousels: []
        })
        const router = useRouter();
        /**
         * 跳转到个人中心页面
         * @returns {Promise<void>}
         */
        const toPersonal = async () => {
            await router.push('/user/person')
        }
        /**
         * 展示发布选项
         * @returns {Promise<void>}
         */
        const showPublishOption = async () => {
            data.show = true
        }
        /**
         * 跳转到发布商品页面
         * @returns {Promise<void>}
         */
        const toCommodityPublish = async () => {
            router.push("/commodity/publish")
        }
        /**
         * 跳转到闲置商品首页
         * @returns {Promise<void>}
         */
        const toCommodityIndex = async () => {
            await router.push("/commodity/index")
        }

        /**
         * 跳转到失物招领首页
         * @returns {Promise<void>}
         */
        const toLostFoundItem = async () => {
            await router.push("/lostFoundItem/index")
        }

        /**
         * 跳转到发布失物招领页面
         * @returns {Promise<void>}
         */
        const toLostFoundItemPublish = async () => {
            router.push("/lostFoundItem/publish")
        }
        /**
         * 跳转到表白墙发布页面
         * @returns {Promise<void>}
         */
        const toConfessionWallPublish = async () => {
            Notify({type: 'warning', message: '敬请期待'});
        }
        /**
         * 跳转到表白墙首页
         */
        const toConfessionalWallIndex = () => {
            router.push('/confessionalWall/index')
        }
        /**
         * 跳转到树洞首页
         */
        const toTreeHole = () => {
            router.push("/treeHole/index")
        }
        /**
         * 跳转到头条新闻首页
         */
        const toHeadlineNewsIndex = () => {
            router.push("/headlineNews/index")
        }
        /**
         * 查询全部启用的轮播图
         */
        const listAllEnableCarousel = () => {
            listAllEnable().then(res => {
                data.carousels = res.data
            })
        }
        onMounted(() => {
            latest().then(res => {
                if (!res.data.isRead) {
                    let message = ''
                    res.data.contents.forEach(function (content, index) {
                        message += (index + 1) + "." + content + "\n"
                    })
                    Dialog.alert({
                        title: res.data.version + '更新日志',
                        message: message,
                        messageAlign: "left",
                    }).then(() => {
                        // 调用已读接口
                        read(res.data.uuid).then(() => {

                        })
                    });
                }
            })
            listAllEnableCarousel()
        })
        return {
            data,
            toPersonal,
            showPublishOption,
            toCommodityIndex,
            toCommodityPublish,
            toLostFoundItem,
            toLostFoundItemPublish,
            toConfessionWallPublish,
            toConfessionalWallIndex,
            toTreeHole,
            toHeadlineNewsIndex,
        }
    }
}
</script>

<style scoped>
.notice-swipe {
    height: 40px;
    line-height: 40px;
}
</style>