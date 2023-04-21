<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-list
            v-model:loading="data.loading"
            :finished="data.finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-cell :title="userFollow.followedUserNickName" v-for="userFollow in data.userFollowList"
                      :key="userFollow.uuid"
                      @click="toCircleDetail(circle.uuid)">
                <template #label>
                    <span>{{ userFollow.followedUserSignature }}</span>
                </template>
                <template #icon>
                    <van-image round width="50" height="50"
                               :src="userFollow.followedUserAvatar"
                               style="margin-right:10px"/>
                </template>
                <template #value>
                    <van-button type="primary" icon="cross" size="mini"
                                @click="cancelFollowUser(userFollow.followedUserUuid)">
                        取消关注
                    </van-button>
                </template>
            </van-cell>
        </van-list>
    </div>
</template>

<script>
import {reactive} from "vue";
import {cancelFollow, pageFollow} from "@/api/user/user";
import {Notify} from "vant";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '关注列表',
            navbarPath: '/user/person',
            loading: true,
            finished: false,
            userFollowList: []
        })
        const pageSearchParam = reactive({
            page: 0,
            size: 10
        })
        /**
         * 分页查询关注列表
         */
        const pageSearchFollow = () => {
            pageFollow(pageSearchParam).then(res => {
                if (res.data.records.length < pageSearchParam.size) {
                    data.finished = true;
                }
                data.userFollowList = data.userFollowList.concat(res.data.records)
            })
        }
        /**
         * 加载
         * @returns {Promise<void>}
         */
        const onLoad = () => {
            pageSearchParam.page++
            pageSearchFollow()
        }
        /**
         * 取消关注用户
         */
        const cancelFollowUser = (uuid) => {
            cancelFollow(uuid).then(() => {
                Notify({type: "success", message: "已取消关注", duration: 1000});
                pageSearchParam.page = 0
                data.finished = false
                data.userFollowList = []
                onLoad()
            })
        }
        return {data, onLoad, cancelFollowUser}
    }
}
</script>