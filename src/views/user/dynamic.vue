<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-dropdown-menu>
            <van-dropdown-item v-model="dynamicSearchParam.type" :options="data.dynamicTypes"
                               :title="data.dynamicTypeTitle" @change="changeDynamicType"/>
            <van-dropdown-item v-model="dynamicSearchParam.circleUuid" :options="data.circles"
                               :title="data.circleTitle" @change="changeCircle"/>
        </van-dropdown-menu>
        <van-list
            v-model:loading="data.loading"
            :finished="data.finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-card
                v-for="dynamic in data.dynamics"
                :key="dynamic.uuid">
                <template #num>
                    <van-tag round type="primary" v-if="dynamic.status === 1">待审核</van-tag>
                    <van-tag round type="danger" v-if="dynamic.status === 2">未通过</van-tag>
                </template>
                <template #desc>
                    <van-space direction="vertical">
                        <div style="margin-top: 10px" class="content" @click="toDynamicDetail(dynamic.uuid)">
                            {{ dynamic.content }}
                        </div>
                        <div>
                            <van-space wrap>
                                <van-image width="100" height="100" v-for="(image,index) in dynamic.images"
                                           :key="image"
                                           :src="image" @click="showImage(index,dynamic.images)" fit="cover"/>
                            </van-space>
                        </div>
                    </van-space>
                </template>
                <template #price>
                    <van-space style="margin-top: 20px" :size="10">
                        <van-icon name="chat"/>
                        <span>{{ dynamic.commentCount }}</span>
                        <van-icon name="eye"/>
                        <span>{{ dynamic.viewCount }}</span>
                        <van-icon name="thumb-circle"/>
                        <span>{{ dynamic.kudosCount }}</span>
                        <van-icon name="clock"/>
                        <span>{{ dynamic.createTime }}</span>
                    </van-space>
                </template>
                <template #tags>
                    <div>
                        <van-tag plain type="success" style="margin-right: 5px">{{ dynamic.typeName }}
                        </van-tag>
                        <van-tag plain color="#7232dd" style="margin-right: 5px">{{
                                dynamic.publishCircleTitle
                            }}
                        </van-tag>
                        <van-tag plain type="primary" v-for="label in dynamic.labels" :key="label"
                                 style="margin-right: 5px;margin-top: 10px">{{ label }}
                        </van-tag>
                    </div>
                </template>
                <template #footer>
                    <van-button size="mini" icon="edit" v-if="dynamic.status === 2" @click="toEdit(dynamic.uuid)">编辑
                    </van-button>
                    <van-button size="mini" v-if="!dynamic.isSyncLibertySquare" type="success"
                                @click="syncCommodityLibertySquare(dynamic.uuid)">
                        同步广场
                    </van-button>
                    <van-button size="mini" v-if="dynamic.isSyncLibertySquare" type="warning"
                                @click="cancelSyncCommodityLibertySquare(dynamic.uuid)">
                        取消同步广场
                    </van-button>
                    <van-button size="mini" type="success" v-if="dynamic.isHide" @click="displayDynamic(dynamic)">显示
                    </van-button>
                    <van-button size="mini" type="warning" v-if="!dynamic.isHide" @click="hideDynamic(dynamic)">隐藏
                    </van-button>
                    <van-button size="mini" type="success" v-if="!dynamic.isOpenComment" @click="open(dynamic)">
                        开启评论
                    </van-button>
                    <van-button size="mini" type="warning" v-if="dynamic.isOpenComment" @click="close(dynamic)">
                        关闭评论
                    </van-button>
                    <van-button size="mini" type="danger" @click="deleteDynamic(dynamic.uuid)">删除</van-button>
                </template>
            </van-card>
        </van-list>
    </div>
</template>
<script>
import {onMounted, reactive} from "vue";
import {
    page2User,
    deleted,
    openComment,
    closeComment,
    display,
    hide,
    syncLibertySquare,
    cancelSyncLibertySquare
} from "@/api/dynamic/dynamic";
import commonUtil from "@/utils/common";
import {Dialog, Notify} from "vant";
import {list} from "@/api/circle/circle";
import {useRouter} from "vue-router";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const router = useRouter();
        const data = reactive({
            navbarTitle: '我的动态',
            navbarPath: '/user/person',
            loading: false,
            finished: false,
            dynamics: [],
            dynamicTypes: [
                {
                    text: '全部',
                    value: 0
                }
            ],
            circles: [
                {
                    text: '全部',
                    value: 0
                }
            ],
            dynamicTypeTitle: '动态类型',
            circleTitle: '圈子'
        })
        const dynamicSearchParam = reactive({
            page: 0,
            size: 10,
            orderType: 'new',
            type: 0,
            circleUuid: ''
        })
        /**
         * 分页查询用户发布的动态
         */
        const pageSearchDynamic = () => {
            page2User(dynamicSearchParam).then(res => {
                const result = res.data.records;
                if (result.length < dynamicSearchParam.size) {
                    data.finished = true
                }
                result.forEach(item => {
                    const dynamicType = commonUtil.dynamicType.find(type => {
                        return type.value === item.type
                    })
                    item.typeName = dynamicType.text
                })
                data.dynamics = data.dynamics.concat(res.data.records)
            })
        }
        const onLoad = () => {
            dynamicSearchParam.page++
            pageSearchDynamic()
        }
        /**
         * 删除动态
         */
        const deleteDynamic = (uuid) => {
            Dialog.confirm({
                title: '删除动态',
                message:
                    '你确定要删除掉该动态吗？',
            })
                .then(() => {
                    deleted(uuid).then(() => {
                        Notify({type: 'success', message: '删除成功', duration: 1000});
                        data.dynamics = []
                        dynamicSearchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 选择动态类型
         * @param value
         */
        const changeDynamicType = (value) => {
            dynamicSearchParam.type = value
            const result = data.dynamicTypes.filter((dynamicType) => {
                return dynamicType.value === value
            })
            data.dynamicTypeTitle = result[0].text
            data.dynamics = []
            dynamicSearchParam.page = 0
            onLoad()
        }
        /**
         * 获取全部圈子
         */
        const listAllCircle = () => {
            list().then(res => {
                const result = res.data
                result.forEach((circle) => {
                    const circleParam = {
                        text: circle.title,
                        value: circle.uuid
                    }
                    data.circles.push(circleParam)
                })
            })
        }
        /**
         * 选择圈子
         * @param value
         */
        const changeCircle = (value) => {
            if (value === 0) {
                dynamicSearchParam.circleUuid = ''
            } else {
                dynamicSearchParam.circleUuid = value
            }
            const result = data.circles.filter((circle) => {
                return circle.value === value
            })
            data.circleTitle = result[0].text
            data.dynamics = []
            dynamicSearchParam.page = 0
            onLoad()
        }
        /**
         * 开启评论
         */
        const open = (dynamic) => {
            Dialog.confirm({
                title: '开启评论',
                message:
                    '你确定要开启该动态的评论吗？',
            })
                .then(() => {
                    openComment(dynamic.uuid).then(() => {
                        Notify({type: 'success', message: '开启成功', duration: 1000});
                        dynamic.isOpenComment = true
                    })
                })
                .catch(() => {

                });
        }
        /**
         * 关闭评论
         */
        const close = (dynamic) => {
            Dialog.confirm({
                title: '关闭评论',
                message:
                    '你确定要关闭该动态的评论吗？',
            })
                .then(() => {
                    closeComment(dynamic.uuid).then(() => {
                        Notify({type: 'success', message: '关闭成功', duration: 1000});
                        dynamic.isOpenComment = false
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
            router.push({path: '/treeHole/whisperEdit', query: {uuid: uuid}})
        }
        /**
         * 显示动态
         * @param dynamic
         */
        const displayDynamic = (dynamic) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '你确定要显示该动态吗？',
            })
                .then(() => {
                    display(dynamic.uuid).then(() => {
                        Notify({type: 'success', message: '显示成功', duration: 1000});
                        dynamic.isHide = false
                    })
                })
                .catch(() => {

                });
        }
        /**
         * 隐藏动态
         * @param dynamic
         */
        const hideDynamic = (dynamic) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '你确定要隐藏该动态吗？',
            })
                .then(() => {
                    hide(dynamic.uuid).then(() => {
                        Notify({type: 'success', message: '隐藏成功', duration: 1000});
                        dynamic.isHide = true
                    })
                })
                .catch(() => {

                });
        }
        /**
         * 取消同步到自由广场
         * @param uuid
         */
        const cancelSyncCommodityLibertySquare = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要将动态从自由广场取消同步吗？',
            })
                .then(() => {
                    cancelSyncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '取消同步成功', duration: 1000});
                        data.dynamics = []
                        dynamicSearchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        /**
         * 同步到自由广场
         * @param uuid
         */
        const syncCommodityLibertySquare = (uuid) => {
            Dialog.confirm({
                title: '提示',
                message:
                    '确定要将动态同步到自由广场吗？',
            })
                .then(() => {
                    syncLibertySquare(uuid).then(() => {
                        Notify({type: 'success', message: '同步成功', duration: 1000});
                        data.dynamics = []
                        dynamicSearchParam.page = 0
                        onLoad()
                    })
                })
                .catch(() => {
                });
        }
        onMounted(() => {
            data.dynamicTypes = data.dynamicTypes.concat(commonUtil.dynamicType)
            listAllCircle()
        })
        return {
            data,
            dynamicSearchParam,
            deleteDynamic,
            onLoad,
            changeDynamicType,
            changeCircle,
            open,
            close,
            toEdit,
            displayDynamic,
            hideDynamic,
            cancelSyncCommodityLibertySquare,
            syncCommodityLibertySquare
        }
    }
}
</script>