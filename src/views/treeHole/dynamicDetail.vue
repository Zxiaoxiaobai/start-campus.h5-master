<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-skeleton title :row="3" :animate="true" :round="true" style="margin-top: 20px"
                      :loading="data.skeletonLoading">
            <van-cell>
                <template #icon>
                    <van-image round width="30px" height="30px" fit="cover" :src="data.dynamicDetail.publishUserAvatar"/>
                </template>
                <template #title>
                <span
                    style="margin-left: 5px;color: #6B7280;font-size: 15px; display: flex;align-items: center;height: 100%;">{{
                        data.dynamicDetail.publishUserNickName
                    }}</span>
                </template>
            </van-cell>
            <van-cell>
                <template #title>
                    <div style="display: flex;align-items: center">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-fenlei"></use>
                        </svg>
                        <span>{{
                                data.dynamicDetail.publishCircleTitle
                            }}</span>
                    </div>
                </template>
                <template #value>
                    <van-tag plain type="success">{{ data.dynamicDetail.typeName }}
                    </van-tag>

                </template>
            </van-cell>
            <van-cell :value="data.dynamicDetail.content"/>
            <van-cell>
                <template #value>
                    <van-space :size="1">
                        <van-tag plain type="primary" v-for="label in data.dynamicDetail.labels" :key="label"
                                 style="margin-right: 5px;margin-top: 10px">{{ label }}
                        </van-tag>
                    </van-space>
                </template>
            </van-cell>
            <img v-for="(img) in data.dynamicDetail.images" v-lazy="img" :key="img"
                 style="width:100%;"
                 @click="showImage(index,data.dynamicDetail.images)"/>
        </van-skeleton>
        <div class="kudos-show">
            <van-icon name="thumb-circle" size="30px" v-if="!data.isKudos"
                      @click="dynamicKudos(data.dynamicDetail.uuid)" :badge="data.kudosCount"/>
            <van-icon name="thumb-circle" color="#1989fa" size="30px" :badge="data.kudosCount" v-if="data.isKudos"
                      @click="dynamicCancelKudos(data.dynamicDetail.uuid)"/>
        </div>
        <div class="comment-show">
            <van-icon name="chat-o" size="30px" :badge="data.commentCount" @click="showComment"/>
        </div>
        <van-popup v-model:show="data.commentShow" position="bottom" :style="{ height: '60%' }">
            <van-divider
                :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
            >
                评论列表
            </van-divider>
            <div style="height: var(--van-tabbar-height)"></div>
            <van-empty description="暂无评论"
                       v-if="data.dynamicParentComments.length === 0 && data.dynamicDetail.isOpenComment"/>
            <van-list v-model="data.commentLoading" :finished="data.commentFinished" :offset="10"
                      @load="onLoad" v-if="data.dynamicDetail.isOpenComment">
                <van-cell v-for="dynamicComment in data.dynamicParentComments"
                          :key="dynamicComment.uuid">
                    <template #icon>
                        <van-image round width="30" height="30" style="margin-right: 10px;"
                                   :src="dynamicComment.commentUserAvatar"/>
                    </template>
                    <van-space>
                        <span style="color: #466b9d;">{{ dynamicComment.commentUserNickName }}</span>
                        <van-tag type="danger"
                                 v-if="data.currentUserInfo.uuid === dynamicComment.commentUserUuid">
                            作者
                        </van-tag>
                    </van-space>
                    <div>
                        <p style="color: #363636;">{{ dynamicComment.content }}
                        </p>
                        <p>
                            <span style="margin-right: 10px;">{{ dynamicComment.commentTime }}</span>
                            <van-button size="mini" type="default" @click="replyComment(dynamicComment)">回复
                            </van-button>
                        </p>
                        <p>

                        </p>
                        <van-cell
                            v-for="dynamicChildrenComment in dynamicComment.dynamicChildrenComments"
                            :key="dynamicChildrenComment.uuid">
                            <template #icon>
                                <van-image round width="30" height="30" style="margin-right: 10px;"
                                           :src="dynamicChildrenComment.commentUserAvatar"/>
                            </template>
                            <van-space>
                                <span style="color: #466b9d;">{{ dynamicChildrenComment.commentUserNickName }}</span>
                                <van-tag type="danger"
                                         v-if="data.currentUserInfo.uuid === dynamicChildrenComment.commentUserUuid">
                                    作者
                                </van-tag>
                            </van-space>

                            <div>
                                <p style="color: #363636;">@{{ dynamicChildrenComment.repliedNickName }}
                                    {{ dynamicChildrenComment.content }}
                                </p>
                                <p>
                                            <span style="margin-right: 10px;">{{
                                                    dynamicChildrenComment.commentTime
                                                }}</span>
                                    <van-button size="mini" type="default"
                                                @click="replyComment(dynamicChildrenComment)">回复
                                    </van-button>
                                </p>
                            </div>
                        </van-cell>
                        <van-button size="mini" icon="arrow-down" type="default"
                                    v-if="dynamicComment.hasChildren && !dynamicComment.isCollapse"
                                    @click="expandMore(dynamicComment.uuid)">展开更多
                        </van-button>
                        <van-button icon="arrow-up" size="mini" type="default" v-if="dynamicComment.isCollapse"
                                    @click="collapse(dynamicComment.uuid)">收起
                        </van-button>
                    </div>
                </van-cell>
            </van-list>
            <van-empty image="error" description="未开启评论" v-if="!data.dynamicDetail.isOpenComment"/>
            <div id="comment" class="send-comment" v-if="data.dynamicDetail.isOpenComment">
                <van-field clearable :placeholder="data.commentPlaceholder" v-model="commentAddRo.content"
                           border
                           size="large"
                           ref="commentContent">
                    <template #button>
                        <van-button round size="mini" type="primary" v-if="data.isReply" @click="cancelComment">取消回复
                        </van-button>
                        <van-button round size="mini" type="primary" @click="addComment()">发送</van-button>
                    </template>
                </van-field>
            </div>
        </van-popup>
        <van-back-top/>
    </div>
</template>
<script>
import {useRoute} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {detail, kudos, cancelKudos, isKudos} from "@/api/dynamic/dynamic";
import commonUtil from "@/utils/common";
import Navbar from "@/components/navbar/navbar";
import {pageParentComment} from "@/api/dynamic/dynamicComment";
import {Notify} from "vant";
import {getUserInfo} from "@/utils/auth";
import {add, reply, pageChildrenComment} from "@/api/dynamic/dynamicComment";

export default {
    components: {Navbar},
    emits: ['click' +
    ''],
    setup() {
        const route = useRoute();
        const data = reactive({
            navbarTitle: '动态详情',
            navbarPath: '/treeHole/index',
            dynamicDetail: '',
            skeletonLoading: true,
            commentLoading: false,
            commentFinished: false,
            // 动态父级评论数组
            dynamicParentComments: [],
            // 是否是回复
            isReply: false,
            // 当前用户信息
            currentUserInfo: getUserInfo(),
            commentPlaceholder: '请输入评论内容',
            //动态评论uuid
            dynamicCommentUuid: '',
            // 动态评论用户uuid
            dynamicCommentUserUuid: '',
            commentShow: false,
            // 是否点赞
            isKudos: false,
            // 评论数量
            commentCount: 0,
            // 点赞数量
            kudosCount: 0
        })
        // 动态父级评论分页查询参数
        const dynamicParentCommentSearchParam = reactive({
            page: 0,
            size: 10
        })
        const commentAddRo = reactive({
            content: '',
            repliedUserUuid: ''
        })
        const commentContent = ref(null);
        /**
         * 获取动态详情
         */
        const dynamicDetail = () => {
          data.skeletonLoading =false
            detail(route.query.uuid).then(res => {
                data.skeletonLoading = false
                data.dynamicDetail = res.data
                if (res.data.commentCount >= 100) {
                    data.commentCount = "99+"
                } else {
                    data.commentCount = res.data.commentCount
                }
                if (res.data.kudosCount >= 100) {
                    data.kudosCount = "99+"
                } else {
                    data.kudosCount = res.data.kudosCount
                }
                const dynamicType = commonUtil.dynamicType.find(type => {
                    return type.value === data.dynamicDetail.type
                })
                data.dynamicDetail.typeName = dynamicType.text
            })
        }
        /**
         * 分页查询父级评论
         */
        const pageSearchDynamicParentComment = () => {
            pageParentComment(dynamicParentCommentSearchParam, route.query.uuid).then(res => {
                const result = res.data.records
                if (result.length < dynamicParentCommentSearchParam.size) {
                    data.commentFinished = true
                }
                data.dynamicParentComments = data.dynamicParentComments.concat(result)
                data.dynamicParentComments.map(dynamicParentComment => {
                    dynamicParentComment.page = 0;
                    dynamicParentComment.size = 10
                    // 用来记录接口返回的评论页数，主要用来判断是否可以展开回复
                    dynamicParentComment.commentPages = 0;
                    dynamicParentComment.dynamicChildrenComments = []
                    // 是否收起
                    dynamicParentComment.isCollapse = false
                })
            })
        }
        /**
         * 动态评论与回复
         */
        const addComment = () => {
            if (commentAddRo.content === '') {
                Notify({type: 'danger', message: '请输入内容'});
                return
            }
            // 判断是评论还是回复
            if (data.isReply) {
                // 判断是否回复自己的评论
                if (data.currentUserInfo.uuid === data.dynamicCommentUserUuid) {
                    Notify({type: 'warning', message: '不能回复自己哦'});
                    return
                }
                // 回复，调用回复的接口
                reply(commentAddRo, data.dynamicCommentUuid).then(() => {
                    Notify({type: 'success', message: '回复成功'});
                })
                commentAddRo.content = ''
                document.getElementById("comment").scrollIntoView()
                commentAddRo.repliedUserUuid = ''
                dynamicParentCommentSearchParam.page = 0
                data.commentFinished = false
                data.dynamicParentComments = []
                data.isReply = false
                onLoad()
                return;
            }
            if (!data.isReply) {
                // 评论，调用评论接口
                commentAddRo.repliedUserUuid = data.dynamicDetail.publishUserUuid
                add(commentAddRo, route.query.uuid).then(() => {
                    Notify({type: 'success', message: '评论成功'});
                    document.getElementById("comment").scrollIntoView()
                    commentAddRo.content = ''
                    commentAddRo.repliedUserUuid = ''
                    dynamicParentCommentSearchParam.page = 0
                    data.commentFinished = false
                    data.dynamicParentComments = []
                    data.isReply = false
                })
            }
        }
        /**
         * 回复
         */
        const replyComment = async (dynamicComment) => {
            data.commentPlaceholder = '@' + dynamicComment.commentUserNickName
            commentAddRo.repliedUserUuid = dynamicComment.commentUserUuid;
            data.dynamicCommentUuid = dynamicComment.uuid
            data.dynamicCommentUserUuid = dynamicComment.commentUserUuid
            data.isReply = true;
            commentContent.value.focus()
        }
        /**
         * 评论加载
         * @returns {Promise<void>}
         */
        const onLoad = () => {
            //只有开启评论才会去查询评论
            if (data.dynamicDetail.isOpenComment) {
                dynamicParentCommentSearchParam.page++
                pageSearchDynamicParentComment()
            }
        }
        /**
         * 取消回复
         */
        const cancelComment = () => {
            commentAddRo.content = ''
            data.commentPlaceholder = '请输入评论内容'
            data.isReply = false
        }
        /**
         * 展示评论
         */
        const showComment = () => {
            data.commentShow = true
        }
        /**
         * 动态是否点赞
         */
        const confessionalWallIsKudos = async () => {
            isKudos(route.query.uuid).then(res => {
                data.isKudos = res.data
            })
        }
        /**
         * 动态点赞
         * @param {*} uuid
         */
        const dynamicKudos = (uuid) => {
            kudos(uuid).then(() => {
                data.isKudos = true;
                Notify({type: 'success', message: '感谢点赞', duration: 1000});
            })
        }
        /**
         * 动态取消点赞
         * @param {*} uuid
         */
        const dynamicCancelKudos = (uuid) => {
            cancelKudos(uuid).then(() => {
                data.isKudos = false;
                Notify({type: 'success', message: '取消成功', duration: 1000});
            })
        }
        /**
         * 展开更多
         */
        const expandMore = (dynamicCommentUuid) => {
            const currentDynamicComment = data.dynamicParentComments.filter(dynamicComment => {
                return dynamicComment.uuid === dynamicCommentUuid
            })
            currentDynamicComment[0].page++
            const search = {
                page: currentDynamicComment[0].page,
                size: currentDynamicComment[0].size
            }
            pageChildrenComment(search, dynamicCommentUuid).then(res => {
                if (search.size > res.data.records.length) {
                    currentDynamicComment[0].isCollapse = true
                }
                currentDynamicComment[0].dynamicChildrenComments = currentDynamicComment[0].dynamicChildrenComments.concat(res.data.records)
                currentDynamicComment[0].commentPages = res.data.pages
            })
        }
        /**
         * 收起
         * @param {*} dynamicCommentUuid
         */
        const collapse = (dynamicCommentUuid) => {
            const currentDynamicComment = data.dynamicParentComments.filter(dynamicComment => {
                return dynamicComment.uuid === dynamicCommentUuid
            })
            currentDynamicComment[0].dynamicChildrenComments = []
            currentDynamicComment[0].isCollapse = false
            currentDynamicComment[0].page = 0
            currentDynamicComment[0].size = 10
            currentDynamicComment[0].commentPages = 0
        }
        onMounted(() => {
            dynamicDetail()
            confessionalWallIsKudos()
        })
        return {
            data,
            commentAddRo,
            commentContent,
            addComment,
            replyComment,
            onLoad,
            cancelComment,
            showComment,
            dynamicKudos,
            dynamicCancelKudos,
            expandMore,
            collapse
        }
    }
}
</script>
<style>
.comment-show {
    position: fixed;
    bottom: 200px;
    right: 20px;
}

.send-comment {
    position: fixed;
    bottom: 5px;
    width: 100%;
}

.kudos-show {
    position: fixed;
    bottom: 300px;
    right: 20px;
}
</style>