<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <iframe :src="data.headlineNewsDetail.url" id="frames"
                frameborder="0"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                style="height: 800px; width: 100%" loading="lazy">
        </iframe>
    </div>
</template>

<script>
import {detail} from "@/api/headlineNews/headlineNews";
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '新闻详情',
            navbarPath: '/headlineNews/index',
            headlineNewsDetail: ''
        })
        const route = useRoute()
        /**
         * 获取头条新闻详情
         */
        const getHeadlineNesDetail = () => {
            detail(route.query.uuid).then(res => {
                data.headlineNewsDetail = res.data
            })
        }
        onMounted(() => {
            getHeadlineNesDetail()
        })
        return {
            data
        }
    }
}
</script>