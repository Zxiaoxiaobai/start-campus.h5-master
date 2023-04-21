<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-tabs v-model:active="active" @click-tab="changeTab">
            <van-tab title="我关注的" name="follow">
                <van-list
                    v-model:loading="data.followLoading"
                    :finished="data.followFinished"
                    finished-text="没有更多了"
                    @load="loadFollow"
                >
                    <van-cell :title="circle.title" v-for="circle in data.followCircles" :key="circle.uuid"
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
            </van-tab>
            <van-tab title="我创建的" name="create">
                <van-list
                    v-model:loading="data.createLoading"
                    :finished="data.createFinished"
                    finished-text="没有更多了"
                    @load="loadCreate"
                >
                    <van-swipe-cell v-for="circle in data.createCircles" :key="circle.uuid">
                        <van-cell :title="circle.title"
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
                                <van-tag type="success" v-if="!circle.disabled">启用</van-tag>
                                <van-tag type="warning" v-if="circle.disabled && circle.status === 3">禁用</van-tag>
                                <van-tag type="danger" v-if="circle.disabled && circle.status === 2">未通过</van-tag>
                                <van-tag type="primary" v-if="circle.disabled && circle.status === 1">待审核</van-tag>
                            </template>
                        </van-cell>
                        <template #right>
                            <van-button square type="primary" text="编辑" class="right-button"
                                        v-if="circle.status === 2" @click="toEdit(circle.uuid)"/>
                            <van-button square type="success" text="启用" class="right-button"
                                        v-if="circle.disabled && circle.status === 3"
                                        @click="enableCircle(circle.uuid)"/>
                            <van-button square type="warning" text="禁用" class="right-button"
                                        v-if="!circle.disabled && circle.status === 3"
                                        @click="disableCircle(circle.uuid)"/>
                            <van-button square type="danger" text="删除" class="right-button"
                                        @click="deleteCircle(circle.uuid)"/>
                        </template>
                    </van-swipe-cell>
                </van-list>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import {onMounted, reactive, ref} from "vue";
import Navbar from "@/components/navbar/navbar";
import {page2User, enable, disable, deleted} from "@/api/circle/circle";
import {Dialog, Notify} from "vant";
import {useRouter} from "vue-router";

export default {
    components: {Navbar},
    setup() {
        const router = useRouter();
        const active = ref(0);
        const data = reactive({
            navbarTitle: '我的圈子',
            navbarPath: '/user/person',
            followCircles: [],
            createCircles: [],
            followLoading: false,
            followFinished: false,
            createLoading: false,
            createFinished: false,
        })
        const followSearchParam = reactive({
            page: 0,
            size: 5,
            type: 'follow'
        })
        const createSearchParam = reactive({
            page: 0,
            size: 5,
            type: 'create'
        })
        /**
         * 切换tab
         * @param value
         */
        const changeTab = (value) => {
            if (value.name === 'follow') {
                data.followCircles = []
                data.followFinished = false
                followSearchParam.page = 0
                loadFollow()
            }
            if (value.name === 'create') {
                data.createCircles = []
                data.createFinished = false
                createSearchParam.page = 0
                loadCreate()

            }
        }
        /**
         * 查询我关注的圈子
         * @returns {Promise<void>}
         */
        const pageFollow = async () => {
            page2User(followSearchParam).then(res => {
                const result = res.data.records;
                if (result.length < followSearchParam.size) {
                    data.followFinished = true
                }
                data.followCircles = data.followCircles.concat(result)
            })
        }
        /**
         * 查询我创建的圈子
         * @returns {Promise<void>}
         */
        const pageCreate = async () => {
            page2User(createSearchParam).then(res => {
                const result = res.data.records;
                if (result.length < createSearchParam.size) {
                    data.createFinished = true
                }
                data.createCircles = data.createCircles.concat(result)
            })
        }
        /**
         * 分页加载我关注的
         */
        const loadFollow = () => {
            followSearchParam.page++
            pageFollow()
        }
        /**
         * 分页加载我创建的
         */
        const loadCreate = () => {
            createSearchParam.page++
            pageCreate()
        }
        /**
         * 启用圈子
         */
        const enableCircle = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要启用该圈子吗？',
            })
                .then(() => {
                    enable(uuid).then(() => {
                        Notify({type: 'success', message: '启用成功'});
                        data.createFinished = false
                        data.createCircles = []
                        createSearchParam.page = 0
                        loadCreate()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 禁用圈子
         */
        const disableCircle = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要禁用该圈子吗？',
            })
                .then(() => {
                    disable(uuid).then(() => {
                        Notify({type: 'success', message: '禁用成功'});
                        data.createFinished = false
                        data.createCircles = []
                        createSearchParam.page = 0
                        loadCreate()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 删除圈子
         * @param uuid
         */
        const deleteCircle = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要删除该圈子吗？',
            })
                .then(() => {
                    deleted(uuid).then(() => {
                        Notify({type: 'success', message: '删除成功'});
                        data.createFinished = false
                        data.createCircles = []
                        createSearchParam.page = 0
                        loadCreate()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 编辑页面
         * @param uuid
         */
        const toEdit = (uuid) => {
            router.push({path: "/treeHole/circle/edit", query: {uuid: uuid}})
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
            active,
            data,
            changeTab,
            loadFollow,
            loadCreate,
            enableCircle,
            disableCircle,
            deleteCircle,
            toEdit,
            toCircleDetail
        }
    }
}
</script>
<style>
.right-button {
    height: 100%;
}
</style>