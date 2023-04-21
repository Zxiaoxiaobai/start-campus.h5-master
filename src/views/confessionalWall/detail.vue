<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-skeleton title :row="3" :animate="true" :round="true" style="margin-top: 20px"
                      :loading="data.skeletonLoading">
            <van-cell>
                <template #icon>
                    <van-image round width="30px" height="30px" fit="cover" :src="data.confessionalWallDetail.avatar"/>
                </template>
                <template #title>
                <span
                    style="margin-left: 5px;color: #6B7280;font-size: 15px; display: flex;align-items: center;height: 100%;">{{
                        data.confessionalWallDetail.publishNickName
                    }}</span>
                </template>
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template #right-icon>
                    <van-button type="success" icon="plus" size="mini" v-if="!data.isFollowUser"
                                @click="followUser">关注
                    </van-button>
                    <van-button type="primary" icon="cross" size="mini" v-if="data.isFollowUser"
                                @click="cancelFollowUser">
                        取消关注
                    </van-button>
                </template>
            </van-cell>
            <van-cell>
                <template #value>
                    <span>{{ data.confessionalWallDetail.content }}</span>
                    <img v-for="(img,index) in data.confessionalWallDetail.images" v-lazy="img" :key="img"
                         style="width: 100%"
                         @click="showImage(index,data.confessionalWallDetail.images)"/>
                </template>
            </van-cell>
            <div class="kudos-show">
                <van-icon name="thumb-circle" size="30px" v-if="!data.isKudos"
                          @click="confessionalWallKudos(data.confessionalWallDetail.uuid)"
                          :badge="data.kudosCount"/>
                <van-icon name="thumb-circle" color="#1989fa" size="30px" :badge="data.kudosCount"
                          v-if="data.isKudos"
                          @click="confessionalWallCancelKudos(data.confessionalWallDetail.uuid)"/>
            </div>
            <div class="comment-show">
                <van-icon name="chat-o" size="30px" :badge="data.commentCount" @click="showComment"/>
            </div>
            <van-popup round closeable v-model:show="data.commentShow" position="bottom"
                       :style="{ height: '80%' }">
                <van-divider id="comment"
                             :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px', marginTop: '50px' }"
                >
                    评论列表
                </van-divider>
                <van-list v-model="data.loading" :finished="data.finished" :offset="10"
                          finished-text="没有更多了"
                          @load="onLoad" v-if="data.confessionalWallDetail.isOpenComment">
                    <van-cell v-for="confessionalWallComment in data.confessionalWallParentComments"
                              :key="confessionalWallComment.uuid" style="user-select: none">
                        <template #icon>
                            <van-image round width="30" height="30" style="margin-right: 10px;"
                                       :src="confessionalWallComment.commentAvatar"/>
                        </template>
                        <van-space>
                            <span style="color: #466b9d;">{{ confessionalWallComment.commentNickName }}</span>
                            <van-tag type="danger"
                                     v-if="data.currentUserInfo.uuid === data.confessionalWallDetail.publishUserUuid">
                                作者
                            </van-tag>
                        </van-space>
                        <div>
                            <p style="color: #363636"
                               @touchstart.prevent="onLongPressCallbackComponent(confessionalWallComment)"
                               @touchend.prevent="goTouchend" class="longPress">
                                {{ confessionalWallComment.content }}
                            </p>
                            <p>
                                <span style="margin-right: 10px;">{{ confessionalWallComment.commentTime }}</span>
                                <van-button size="mini" type="default"
                                            @click="replyComment(confessionalWallComment)">回复
                                </van-button>
                            </p>
                            <p>

                            </p>
                            <van-cell
                                v-for="confessionalWallChildrenComment in confessionalWallComment.confessionalWallChildrenComments"
                                :key="confessionalWallChildrenComment.uuid">
                                <template #icon>
                                    <van-image round width="30" height="30" style="margin-right: 10px;"
                                               :src="confessionalWallChildrenComment.commentAvatar"/>
                                </template>
                                <van-space>
                                     <span style="color: #466b9d;">{{
                                             confessionalWallChildrenComment.commentNickName
                                         }}</span>
                                    <van-tag type="danger"
                                             v-if="data.currentUserInfo.uuid === data.confessionalWallDetail.publishUserUuid">
                                        作者
                                    </van-tag>
                                </van-space>
                                <div>
                                    <p style="color: #363636;"
                                       @touchstart.prevent="onLongPressCallbackComponent(confessionalWallChildrenComment)"
                                       class="longPress">@{{
                                            confessionalWallChildrenComment.repliedNickName
                                        }}
                                        {{ confessionalWallChildrenComment.content }}
                                    </p>
                                    <p>
                                <span style="margin-right: 10px;">{{
                                        confessionalWallChildrenComment.commentTime
                                    }}</span>
                                        <van-button size="mini" type="default"
                                                    @click="replyComment(confessionalWallChildrenComment)">回复
                                        </van-button>
                                    </p>
                                </div>
                            </van-cell>
                            <van-button size="mini" icon="arrow-down" type="default"
                                        v-if="confessionalWallComment.hasChildren && !confessionalWallComment.isCollapse"
                                        @click="expandMore(confessionalWallComment.uuid)">展开更多
                            </van-button>
                            <van-button icon="arrow-up" size="mini" type="default"
                                        v-if="confessionalWallComment.isCollapse"
                                        @click="collapse(confessionalWallComment.uuid)">收起
                            </van-button>
                        </div>
                    </van-cell>
                </van-list>
                <van-empty image="error" description="未开启评论"
                           v-if="!data.confessionalWallDetail.isOpenComment"/>
                <van-sticky :container="container" position="bottom"
                            v-if="data.confessionalWallDetail.isOpenComment">
                    <van-cell-group class="publish-wrap">
                        <van-field clearable :placeholder="data.commentPlaceholder"
                                   v-model="commentAddRo.content"
                                   @blur="cancelFocus"
                                   ref="commentContent">
                            <template #button>
                                <van-button size="mini" type="primary" @click="addComment()">发送</van-button>
                            </template>
                        </van-field>
                    </van-cell-group>
                </van-sticky>
            </van-popup>
            <van-popup round closeable v-model:show="data.replyCommentShow" position="bottom"
                       style="height: 30%;"
                       :overlay-style="{backgroundColor: 'rgba(0,0,0,0.1)'}" :z-index="9999">
                <div style="margin-top: 50px">
                    <van-cell title="删除" icon="clear" v-if="data.isCanDelete"
                              @click="deleteComment"/>
                    <van-cell title="举报" icon="warning" is-link @click="toCommentReport" v-if="data.isCanReport"/>
                </div>
            </van-popup>
        </van-skeleton>
    </div>
</template>

<script>
import {reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {detail, isKudos, kudos, cancelKudos} from '@/api/confessionalWall/confessionalWall'
import {add, pageParentComment, reply, pageChildrenComment, deleted} from '@/api/confessionalWall/confessionalWallComment'
import {ImagePreview, Notify} from 'vant';
import {ref} from "vue"
import {getUserInfo} from '@/utils/auth'
import {cancelFollow, follow, isFollow} from "@/api/user/user";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '表白墙详情',
            navbarPath: '/confessionalWall/index',
            confessionalWallDetail: '',
            confessionalWallParentComments: [],
            loading: false,
            finished: false,
            commentPlaceholder: '请输入评论内容',
            isReply: false,
            // 表白墙评论uuid
            confessionalWallCommentUuid: '',
            // 表白墙评论用户uuid
            confessionalWallCommentUserUuid: '',
            // 当前用户信息
            currentUserInfo: getUserInfo(),
            isKudos: false,
            // 骨架屏
            skeletonLoading: true,
            // 是否关注该用户
            isFollowUser: false,
            commentShow: false,
            // 评论数量
            commentCount: 0,
            // 点赞数量
            kudosCount: 0,
            replyCommentShow: false,
            // 记录手指触摸时长
            timeOutEvent: 0,
            // 是否能删除评论
            isCanDelete: false,
            // 是否能举报评论
            isCanReport: true,
            // 长按当前评论信息
            currentCommentInfo: ''
        })
        const route = useRoute()
        const router = useRouter();
        const commentAddRo = reactive({
            content: '',
            repliedUserUuid: ''
        })
        const searchParam = reactive({
            page: 0,
            size: 10
        })
        const container = ref(null);
        const commentContent = ref(null);
        /**
         * 表白墙详情
         * @param {*} uuid
         *
         */
        const confessionalWallDetail = async () => {
            detail(route.query.uuid).then(res => {
                data.confessionalWallDetail = res.data
                data.skeletonLoading = false
                if (res.data.commentCount > 100) {
                    data.commentCount = "99+"
                } else {
                    data.commentCount = res.data.commentCount
                }
                if (res.data.kudosCount > 100) {
                    data.kudosCount = "99+"
                } else {
                    data.kudosCount = res.data.kudosCount
                }
                // 是否关注
                isFollow(data.confessionalWallDetail.publishUserUuid).then(res => {
                    data.isFollowUser = res.data
                })
            })
        }
        /**
         * 查看图片
         * @param {*} index
         * @param {*} images
         */
        const showImage = (index, images) => {
            ImagePreview({
                images: images,
                showIndex: true,
                loop: false,
                startPosition: index
            })
        }
        /**
         * 表白墙评论
         */
        const addComment = () => {
            // 判断是评论还是回复
            if (data.isReply) {
                // 判断是否回复自己的评论
                if (data.currentUserInfo.uuid === data.confessionalWallCommentUserUuid) {
                    Notify({type: 'warning', message: '不能回复自己哦'});
                    return
                }
                // 回复，调用回复的接口
                reply(commentAddRo, data.confessionalWallCommentUuid).then(() => {
                    Notify({type: 'success', message: '回复成功'});
                })
                commentAddRo.content = ''
                document.getElementById("comment").scrollIntoView()
                commentAddRo.repliedUserUuid = ''
                searchParam.page = 0
                data.finished = false
                data.confessionalWallParentComments = []
                data.isReply = false
                onLoad()
            }
            if (!data.isReply) {
                // 评论，调用评论接口
                commentAddRo.repliedUserUuid = data.confessionalWallDetail.publishUserUuid
                add(commentAddRo, route.query.uuid).then(() => {
                    Notify({type: 'success', message: '评论成功'});
                    document.getElementById("comment").scrollIntoView()
                    commentAddRo.content = ''
                    commentAddRo.repliedUserUuid = ''
                    searchParam.page = 0
                    data.finished = false
                    data.confessionalWallParentComments = []
                })
                data.isReply = false
                onLoad()
            }
        }
        /**
         * 分页查询表白墙父级评论
         */
        const pageSearchConfessionalWallParentComment = async () => {
            pageParentComment(searchParam, route.query.uuid).then(res => {
                if (res.data.records.length < searchParam.size) {
                    data.finished = true
                }
                data.confessionalWallParentComments = data.confessionalWallParentComments.concat(
                    res.data.records)
                data.confessionalWallParentComments.map(confessionalWallParentComment => {
                    confessionalWallParentComment.page = 0;
                    confessionalWallParentComment.size = 10;
                    // 用来记录接口返回的评论页数，主要用来判断是否可以展开回复
                    confessionalWallParentComment.commentPages = 0;
                    confessionalWallParentComment.confessionalWallChildrenComments = []
                    // 是否收起
                    confessionalWallParentComment.isCollapse = false
                })
            })

        }
        /**
         * 评论加载
         * @returns {Promise<void>}
         */
        const onLoad = () => {
            //只有开启评论才会去查询评论
            if (data.confessionalWallDetail.isOpenComment) {
                searchParam.page++
                pageSearchConfessionalWallParentComment()
            }
        }
        /**
         * 回复
         */
        const replyComment = async (confessionalWallComment) => {
            data.commentPlaceholder = '@' + confessionalWallComment.commentNickName
            commentAddRo.repliedUserUuid = confessionalWallComment.commentUserUuid;
            data.confessionalWallCommentUuid = confessionalWallComment.uuid
            data.confessionalWallCommentUserUuid = confessionalWallComment.commentUserUuid
            data.isReply = true;
            commentContent.value.focus()
        }
        const cancelFocus = () => {
            data.commentPlaceholder = '请输入评论内容'
        }
        /**
         * 展开更多
         */
        const expandMore = (confessionalWallCommentUuid) => {
            const currentConfessionalWallComment = data.confessionalWallParentComments.filter(
                confessionalWallComment => {
                    return confessionalWallComment.uuid === confessionalWallCommentUuid
                })
            currentConfessionalWallComment[0].page++
            const search = {
                page: currentConfessionalWallComment[0].page,
                size: currentConfessionalWallComment[0].size
            }
            pageChildrenComment(search, confessionalWallCommentUuid).then(res => {
                if (search.size > res.data.records.length) {
                    currentConfessionalWallComment[0].isCollapse = true
                }
                currentConfessionalWallComment[0].confessionalWallChildrenComments = currentConfessionalWallComment[0].confessionalWallChildrenComments.concat(
                    res.data.records)
                currentConfessionalWallComment[0].commentPages = res.data.pages
            })
        }
        /**
         * 收起
         * @param {*} confessionalWallCommentUuid
         */
        const collapse = (confessionalWallCommentUuid) => {
            const currentConfessionalWallComment = data.confessionalWallParentComments.filter(
                confessionalWallComment => {
                    return confessionalWallComment.uuid === confessionalWallCommentUuid
                })
            currentConfessionalWallComment[0].confessionalWallChildrenComments = []
            currentConfessionalWallComment[0].isCollapse = false
            currentConfessionalWallComment[0].page = 0
            currentConfessionalWallComment[0].size = 10
            currentConfessionalWallComment[0].commentPages = 0
        }

        /**
         * 表白墙是否点赞
         */
        const confessionalWallIsKudos = async () => {
            isKudos(route.query.uuid).then(res => {
                data.isKudos = res.data
            })
        }
        /**
         * 表白墙点赞
         * @param {*} uuid
         */
        const confessionalWallKudos = (uuid) => {
            kudos(uuid).then(() => {
                data.isKudos = true;
                Notify({type: 'success', message: '感谢点赞', duration: 1000});
            })
        }
        /**
         * 表白墙取消点赞
         * @param {*} uuid
         */
        const confessionalWallCancelKudos = (uuid) => {
            cancelKudos(uuid).then(() => {
                data.isKudos = false;
                Notify({type: 'success', message: '取消成功', duration: 1000});
            })
        }
        /**
         * 关注用户
         */
        const followUser = () => {
            follow(data.confessionalWallDetail.publishUserUuid).then(() => {
                Notify({type: "success", message: "感谢关注", duration: 1000});
                data.isFollowUser = true
            })
        }
        /**
         * 取消关注用户
         */
        const cancelFollowUser = () => {
            cancelFollow(data.confessionalWallDetail.publishUserUuid).then(() => {
                Notify({type: "success", message: "已取消关注", duration: 1000});
                data.isFollowUser = false
            })
        }
        /**
         * 展示评论
         */
        const showComment = () => {
            data.commentShow = true
        }
        /**
         * 长按评论弹出
         */
        const onLongPressCallbackComponent = (confessionalWallComment) => {
            clearTimeout(data.timeOutEvent)
            data.timeOutEvent = setTimeout(function () {
                data.replyCommentShow = true
                data.currentCommentInfo = confessionalWallComment
                if (confessionalWallComment.commentUserUuid === data.currentUserInfo.uuid) {
                    data.isCanDelete = true
                    data.isCanReport = false
                }
            }, 1000)
            return false
        }
        /**
         * 单击评论内容
         * @param confessionalWallComment
         */
        const goTouchend = () => {
            clearTimeout(data.timeOutEvent)
            return false;
        }
        /**
         * 删除评论
         */
        const deleteComment = () => {
            deleted(data.currentCommentInfo.uuid).then(() => {
                Notify({type: "success", message: "删除成功", duration: 1000});
                searchParam.page = 0
                data.finished = false
                data.confessionalWallParentComments = []
                onLoad()
            })
        }
        /**
         * 跳转到评论举报
         */
        const toCommentReport = () => {
            router.push({path: "/commentReport", query: {reportedUserUuid: data.currentCommentInfo.commentUserUuid}})
        }
        onMounted(() => {
            confessionalWallDetail()
            confessionalWallIsKudos()
        })
        return {
            data,
            commentAddRo,
            container,
            commentContent,
            showImage,
            addComment,
            onLoad,
            replyComment,
            cancelFocus,
            expandMore,
            collapse,
            confessionalWallKudos,
            confessionalWallCancelKudos,
            followUser,
            cancelFollowUser,
            showComment,
            onLongPressCallbackComponent,
            goTouchend,
            deleteComment,
            toCommentReport
        }
    }
}
</script>

<style scoped>
.comment-show {
    position: fixed;
    bottom: 200px;
    right: 20px;
}

.kudos-show {
    position: fixed;
    bottom: 300px;
    right: 20px;
}

.longPress:active {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
