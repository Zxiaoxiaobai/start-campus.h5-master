<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <form action="">
            <van-search v-model="headlineNewsSearchParam.keywords" placeholder="请输入标题或内容" @search="onSearch"
                        show-action/>
        </form>
        <van-tabs v-model:active="data.active" @click-tab="onClickTab">
            <van-tab title="local">
                <template #title>
                    本地新闻
                </template>
            </van-tab>
            <van-tab title="other">
                <template #title>
                    其他新闻
                </template>
            </van-tab>
            <van-pull-refresh v-model="data.headlineNewsRefreshing" @refresh="refreshHeadlineNews">
                <van-list
                    :loading="data.headlineNewsLoading"
                    :finished="data.headlineNewsFinished"
                    finished-text="没有更多了"
                    @load="onLoadHeadlineNews"
                    :offset="10"
                >
                    <van-card
                        v-for="headlineNew in data.headlineNews" :key="headlineNew.uuid"
                        :title="headlineNew.title"
                        :thumb="headlineNew.coverImage"
                        :desc="headlineNew.description"
                        @click="toHeadlineNewsDetail(headlineNew.uuid)"
                    >
                        <template #price>
                            <van-space :size="5">
                                <van-icon name="clock-o"/>
                                <span>{{ headlineNew.publishDate }}</span>
                            </van-space>
                        </template>
                        <template #num>
                            来源：
                            <van-tag type="success">{{ headlineNew.source }}</van-tag>
                        </template>
                    </van-card>
                </van-list>
            </van-pull-refresh>
        </van-tabs>
        <div v-if="data.backTopShow" style="position: fixed; right: 30px;bottom: 100px; z-index: 2">
            <svg class="icon" style="font-size: 40px" aria-hidden="true" @click="backTop">
                <use xlink:href="#icon-fanhuidingbu"></use>
            </svg>
        </div>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {page} from "@/api/headlineNews/headlineNews";
import {Toast} from "vant";
import Navbar from "@/components/navbar/navbar";
import {useRouter} from "vue-router";

export default {
    components: {Navbar},
    setup() {
        const headlineNewsSearchParam = reactive({
            keywords: '',
            page: 0,
            size: 10
        })
        const data = reactive({
            navbarTitle: '头条新闻',
            navbarPath: '/',
            active: 0,
            headlineNewsType: 1,
            headlineNews: [],
            headlineNewsFinished: false,
            headlineNewsRefreshing: false,
            headlineNewsLoading: false,
            backTopShow: false,
        })
        let timer = null
        const router = useRouter()
        /**
         * 分页查询头条新闻
         * @returns {Promise<void>}
         */
        const pageSearchHeadlineNews =  () => {
            page(headlineNewsSearchParam, data.headlineNewsType).then(res => {
                const result = res.data.records
                if (result.length < headlineNewsSearchParam.size) {
                    data.headlineNewsFinished = true
                }
                data.headlineNewsRefreshing = false
                data.headlineNews = data.headlineNews.concat(result)
            })
        }
        /**
         * 加载头条新闻
         */
        const onLoadHeadlineNews = () => {
            headlineNewsSearchParam.page++
            pageSearchHeadlineNews()
        }
        /**
         * 下拉刷新头条新闻
         */
        const refreshHeadlineNews = () => {
            data.headlineNews = []
            data.headlineNewsFinished = false
            headlineNewsSearchParam.page = 0
            onLoadHeadlineNews()
            Toast({
                message: '刷新成功',
            });
        }
        /**
         * 显示是否展示回到顶部图标
         */
        const scrollToTop = () => {
            let pageLookHeight = document.documentElement.clientHeight || document.body.clientHeight
            let scroll = document.documentElement.scrollTop
            if (scroll >= pageLookHeight) {
                data.backTopShow = true
            } else {
                data.backTopShow = false
            }
        }
        /**
         * 回到顶部
         */
        const backTop = () => {
            timer = setInterval(function () {
                let backTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                let speedTop = backTop / 5;
                document.documentElement.scrollTop = backTop - speedTop;
                if (backTop === 0) {
                    clearInterval(timer)
                }
            }, 20);
        }
        /**
         * 切换标签
         * @param event
         */
        const onClickTab = (event) => {
            data.headlineNews = []
            headlineNewsSearchParam.page = 0
            if (event.title === 'local') {
                data.headlineNewsType = 1
                onLoadHeadlineNews()
            }
            if (event.title === 'other') {
                data.headlineNewsType = 2
                onLoadHeadlineNews()
            }
        }
        /**
         * 搜索
         */
        const onSearch = () => {
            data.headlineNews = []
            headlineNewsSearchParam.page = 0
            onLoadHeadlineNews()
        }
        /**
         * 跳转到新闻详情
         * @param uuid
         */
        const toHeadlineNewsDetail = (uuid) => {
            router.push({path: '/headlineNews/detail', query: {uuid: uuid}})
        }
        onMounted(() => {
            window.addEventListener('scroll', scrollToTop)
        })
        return {
            headlineNewsSearchParam,
            data,
            onLoadHeadlineNews,
            refreshHeadlineNews,
            backTop,
            onClickTab,
            onSearch,
            toHeadlineNewsDetail
        }
    }
}
</script>