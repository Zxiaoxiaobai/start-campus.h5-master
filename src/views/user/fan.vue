<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-list
            v-model:loading="data.loading"
            :finished="data.finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-cell :title="userFan.followUserNickName" v-for="userFan in data.userFanList"
                      :key="userFan.uuid">
                <template #label>
                    <span>{{ userFan.followUserSignature }}</span>
                </template>
                <template #icon>
                    <van-image round width="50" height="50"
                               :src="userFan.followUserAvatar"
                               style="margin-right:10px"/>
                </template>
            </van-cell>
        </van-list>
    </div>
</template>

<script>
import {reactive} from "vue";
import {pageFan} from "@/api/user/user";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '粉丝列表',
            navbarPath: '/user/person',
            loading: true,
            finished: false,
            userFanList: []
        })
        const pageSearchParam = reactive({
            page: 0,
            size: 10
        })
        /**
         * 分页查询粉丝列表
         */
        const pageSearchFan = () => {
            pageFan(pageSearchParam).then(res => {
                if (res.data.records.length < pageSearchParam.size) {
                    data.finished = true;
                }
                data.userFanList = data.userFanList.concat(res.data.records)
            })
        }
        /**
         * 加载
         * @returns {Promise<void>}
         */
        const onLoad = () => {
            pageSearchParam.page++
            pageSearchFan()
        }
        return {data, onLoad}
    }
}
</script>