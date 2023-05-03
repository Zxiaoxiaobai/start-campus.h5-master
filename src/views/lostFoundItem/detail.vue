<template>
    <div ref="container">
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell>
            <template #icon>
                <van-image round width="30px" height="30px" fit="cover" :src="data.lostFoundItemDetail.publishUserAvatar"/>
            </template>
            <template #title>
                <span
                    style="margin-left: 5px;color: #6B7280;font-size: 15px; display: flex;align-items: center;height: 100%;">{{
                        data.lostFoundItemDetail.publishNickName
                    }}</span>
            </template>
            <template #right-icon>
                <van-button type="success" icon="plus" size="mini" v-if="!data.isFollowUser" @click="followUser">关注
                </van-button>
                <van-button type="primary" icon="cross" size="mini" v-if="data.isFollowUser" @click="cancelFollowUser">
                    取消关注
                </van-button>
            </template>
        </van-cell>
        <van-cell>
            <template #title>
                <van-space :size="10">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-mingcheng"></use>
                    </svg>
                    <span style="font-weight: bold">{{ data.lostFoundItemDetail.name }}</span>
                </van-space>
            </template>
            <template #value>
                <van-space :size="1">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-fenlei"></use>
                    </svg>
                    <span style="font-weight: bold">{{ data.lostFoundItemDetail.categoryName }}</span>
                </van-space>
            </template>
        </van-cell>
        <van-cell>
            <template #title>
                <van-space :size="10">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-didian"></use>
                    </svg>
                    <span style="font-weight: bold">{{ data.lostFoundItemDetail.location }}</span>
                </van-space>
            </template>
            <template #value>
                <van-space :size="1">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-leixing"></use>
                    </svg>
                    <span>{{ data.lostFoundItemDetail.type === 1 ? '拾取物品' : '丢失物品' }}</span>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zhuangtailishi"></use>
                    </svg>
                    <van-tag type="primary" v-if="data.lostFoundItemDetail.status === 1">待审核</van-tag>
                    <van-tag type="danger" v-if="data.lostFoundItemDetail.status === 2">未通过</van-tag>
                    <van-tag type="warning" v-if="data.lostFoundItemDetail.status === 3">未认领</van-tag>
                    <van-tag type="success" v-if="data.lostFoundItemDetail.status === 4">已认领</van-tag>
                    <van-tag type="warning" v-if="data.lostFoundItemDetail.status === 5">未找到</van-tag>
                    <van-tag type="success" v-if="data.lostFoundItemDetail.status === 6">已找到</van-tag>
                    <van-tag type="danger" v-if="data.lostFoundItemDetail.status === 7">已撤回</van-tag>
                </van-space>
            </template>
        </van-cell>
        <van-cell :value="data.lostFoundItemDetail.description"/>
        <img v-for="(img) in data.lostFoundItemDetail.images" v-lazy="img" :key="img"
             style="width: 100%"
             @click="showImage(index,data.lostFoundItemDetail.images)"/>
        <van-divider>联系途径</van-divider>
        <van-contact-card type="edit" :name="data.lostFoundItemDetail.publishNickName"
                          :tel="data.lostFoundItemDetail.contactWay" :editable="false"/>
        <van-divider id="comment">评论列表</van-divider>
        <van-list
            v-model="data.loading"
            :finished="data.finished"
            :offset="10"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-cell v-for="lostFoundItemComment in data.lostFoundItemComments" :key="lostFoundItemComment.uuid">
                <template #icon>
                    <van-image
                        round
                        width="30"
                        height="30"
                        style="margin-right: 10px;"
                        :src="lostFoundItemComment.commentUserAvatar"
                    />
                </template>
                <span style="color: #466b9d;">{{ lostFoundItemComment.commentLoginName }}</span>
                <div>
                    <p style="color: #363636;">{{ lostFoundItemComment.content }}</p>
                    <p>
                        <span style="margin-right: 10px;">{{ lostFoundItemComment.createTime }}</span>
                        <!--            <van-button size="mini" type="default">回复</van-button>-->
                    </p>
                </div>
            </van-cell>
        </van-list>
        <van-sticky :container="container" position="bottom">
            <van-cell-group class="publish-wrap">
                <van-field clearable placeholder="请输入评论内容" v-model="commentAddRo.content">
                    <template #button>
                        <van-button size="mini" type="primary" @click="addComment()">发送</van-button>
                    </template>
                </van-field>
            </van-cell-group>
        </van-sticky>
    </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {detail} from "@/api/lostFoundItem/lostFoundItem";
import {add, page} from "@/api/lostFoundItem/lostFoundItemComment";
import {ImagePreview, Notify} from "vant";
import {getUserInfo} from "@/utils/auth";
import Navbar from "@/components/navbar/navbar";
import {cancelFollow, follow} from "@/api/user/user";

export default {
    name: "detail",
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '物品详情',
            navbarPath: '/lostFoundItem/index',
            lostFoundItemDetail: '',
            lostFoundItemComments: [],
            loading: false,
            finished: false,
            userInfo: getUserInfo()
        })
        const searchParam = reactive({
            page: 0,
            size: 5
        })
        const route = useRoute();
        const container = ref(null);
        const commentAddRo = reactive({
            content: '',
            lostFoundItemUuid: ''
        })
        const lostFoundItemDetail = async () => {
            detail(route.query.uuid).then(res => {
                data.lostFoundItemDetail = res.data
            })
        }
        /**
         * 添加评论
         */
        const addComment = async () => {
            commentAddRo.lostFoundItemUuid = data.lostFoundItemDetail.uuid
            add(commentAddRo).then(() => {
                Notify({type: 'success', message: '评论成功'});
                document.getElementById("comment").scrollIntoView()
                commentAddRo.content = ''
                searchParam.page = 0
                data.finished = true
                data.lostFoundItemComments = []
            })
        }
        /**
         * 分页查询物品评论
         */
        const pageLostFoundItemComment = () => {
            page(route.query.uuid, searchParam).then(res => {
                if (res.data.records.length < searchParam.size) {
                    data.finished = true
                }
                data.lostFoundItemComments = data.lostFoundItemComments.concat(res.data.records)
            })
        }
        /**
         *
         * @returns {Promise<void>}
         */
        const onLoad = () => {
            searchParam.page++
            pageLostFoundItemComment()
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
         * 关注用户
         */
        const followUser = () => {
            follow(data.lostFoundItemDetail.publishUserUuid).then(() => {
                Notify({type: "success", message: "感谢关注", duration: 1000});
                data.isFollowUser = true
            })
        }
        /**
         * 取消关注用户
         */
        const cancelFollowUser = () => {
            cancelFollow(data.lostFoundItemDetail.publishUserUuid).then(() => {
                Notify({type: "success", message: "已取消关注", duration: 1000});
                data.isFollowUser = false
            })
        }
        onMounted(() => {
            lostFoundItemDetail()
        })
        return {
            data,
            commentAddRo,
            container,
            addComment,
            onLoad,
            showImage,
            followUser,
            cancelFollowUser
        }
    }
}
</script>

<style scoped>
</style>