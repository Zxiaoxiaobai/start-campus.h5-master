<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-row>
            <van-col span="18">
                <van-search v-model="searchParam.title" placeholder="请输入圈子标题" @search="onSearch"/>
            </van-col>
            <van-col span="6">
                <van-button icon="plus" type="success" size="small" style="margin-top: 10px"
                            @click="toCreateCircle">创建圈子
                </van-button>
            </van-col>
        </van-row>
        <van-list
            v-model:loading="data.loading"
            :finished="data.finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-cell :title="circle.title" v-for="circle in data.circles" :key="circle.uuid"
                      @click="toCircleDetail(circle.uuid)">
                <template #label>
                    <span>{{ circle.description }}</span>
                </template>
                <template #icon>
                    <van-image round width="50" height="50"
                               :src="circle.avatar"
                               style="margin-right:10px"/>
                </template>
                <template #value>
                    {{ circle.followCount }}人关注
                </template>
            </van-cell>
        </van-list>
    </div>
</template>
<script>
import {onMounted, reactive} from "vue";
import {page} from "@/api/circle/circle";
import {useRouter} from "vue-router";
import Navbar from "@/components/navbar/navbar";

export default ({
    components: {Navbar},
    setup() {
        const router = useRouter();
        const data = reactive({
            navbarTitle: '圈子广场',
            navbarPath: '/treeHole/index',
            circles: [],
            loading: false,
            finished: false
        })
        const searchParam = reactive({
            page: 0,
            size: 10,
            title: ''
        })
        const onClickLeft = async () => {
            history.back();
        }
        /**
         * 分页查询圈子
         */
        const pageSearchCircle = () => {
            page(searchParam).then(res => {
                if (res.data.records.length < searchParam.size) {
                    data.finished = true
                }
                data.circles = data.circles.concat(res.data.records)
            })
        }
        /**
         * 搜索
         */
        const onSearch = () => {
            data.circles = []
            pageSearchCircle()
        }
        const onLoad = () => {
            searchParam.page++
            pageSearchCircle()
        }
        /**
         * 创建圈子
         */
        const toCreateCircle = () => {
            router.push("/treeHole/createCircle")
        }
        /**
         * 跳转到圈子详情
         * @param uuid
         */
        const toCircleDetail = (uuid) => {
            router.push({path: '/treeHole/circle/detail', query: {uuid: uuid}})
        }
        onMounted(() => {
        })
        return {
            data,
            searchParam,
            onClickLeft,
            onSearch,
            onLoad,
            toCreateCircle,
            toCircleDetail
        }
    }
})
</script>