<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-pull-refresh v-model="data.refreshing" @refresh="onRefresh">
            <van-list :loading="data.loading" :finished="data.finished" finished-text="没有更多了"
                      @load="onLoad">
                <div v-for="confessionalWall in data.confessionalWalls" :key="confessionalWall.uuid">
                    <van-cell :border="false">
                        <template #icon>
                            <van-image round width="30" height="30" style="margin-right: 10px;"
                                       :src="confessionalWall.avatar"/>
                        </template>
                        <template #title>
                        <span style="display: flex;align-items: center;height: 100%;font-family: 微软雅黑">{{
                                confessionalWall.publishNickName
                            }}
                           <svg class="icon" aria-hidden="true" style="margin-left: 5px" v-if="data.userInfo.sex === 1">
                            <use xlink:href="#icon-nanshi"></use>
                        </svg>
                         <svg class="icon" aria-hidden="true" style="margin-left: 5px" v-if="data.userInfo.sex === 2">
                            <use xlink:href="#icon-nvshi"></use>
                        </svg>
                        </span>
                        </template>
                    </van-cell>
                    <van-cell :border="false" @click="toConfessionalWallDetail(confessionalWall.uuid)">
                        <template #value>
                            {{ confessionalWall.content }}
                        </template>
                    </van-cell>
                    <van-cell :border="false">
                        <template #value>
                            <van-space wrap>
                                <van-image width="100" height="100" v-for="(image,index) in confessionalWall.images"
                                           :key="image"
                                           :src="image" @click="showImage(index,confessionalWall.images)" fit="cover"/>
                            </van-space>
                            <van-row>
                                <van-col span="4">
                                    <van-space :size="3">
                                        <van-icon name="chat"/>
                                        <span>{{ confessionalWall.commentCount }}</span>
                                    </van-space>
                                </van-col>
                                <van-col span="4">
                                    <van-space :size="3">
                                        <van-icon name="eye"/>
                                        <span>{{ confessionalWall.viewCount }}</span>
                                    </van-space>
                                </van-col>
                                <van-col span="4">
                                    <van-space :size="3">
                                        <van-icon name="thumb-circle"/>
                                        <span>{{ confessionalWall.kudosCount }}</span>
                                    </van-space>
                                </van-col>
                                <van-col span="12">
                                    <van-space :size="3">
                                        <van-icon name="clock"/>
                                        <span>{{ confessionalWall.createTime }}</span>
                                    </van-space>
                                </van-col>
                            </van-row>
                        </template>
                    </van-cell>
                    <van-divider/>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import {reactive, onMounted} from 'vue';
import {page} from '@/api/confessionalWall/confessionalWall';
import {ImagePreview} from 'vant';
import {useRouter} from 'vue-router';
import {getUserInfo} from "@/utils/auth";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '表白墙',
            navbarPath: '/',
            confessionalWalls: [],
            loading: false,
            finished: false,
            userInfo: getUserInfo(),
            isFollowUser: false,
            refreshing: false
        })
        const searchParam = {
            page: 0,
            size: 10,
            orderType: 'default'
        }
        const router = useRouter()
        const pageSearchConfessionalWall = () => {
            page(searchParam).then(res => {
                if (res.data.records.length < searchParam.size) {
                    data.finished = true
                }
                data.refreshing = false
                data.confessionalWalls = data.confessionalWalls.concat(res.data.records);
            })
        }
        /**
         * 跳转到详情页面
         * @param {} uuid
         */
        const toConfessionalWallDetail = (uuid) => {
            router.push({path: '/confessionalWall/detail', query: {uuid: uuid}})
        }
        /**
         * 加载
         */
        const onLoad = () => {
            searchParam.page++
            pageSearchConfessionalWall()
        }
        const showImage = (index, images) => {
            ImagePreview({
                images: images,
                showIndex: true,
                loop: false,
                startPosition: index
            })
        }
        /**
         * 下拉刷新表白墙
         */
        const onRefresh = () => {
            data.confessionalWalls = []
            searchParam.page = 0
            onLoad()
        }
        onMounted(() => {
        })
        return {
            data,
            toConfessionalWallDetail,
            onLoad,
            showImage,
            onRefresh
        }
    }
}
</script>

<style>
/*.content {*/
/*    overflow: hidden;*/
/*    text-overflow: ellipsis;*/
/*    display: -webkit-box;*/
/*    -webkit-box-orient: vertical;*/
/*    -webkit-line-clamp: 3;*/
/*}*/
</style>
