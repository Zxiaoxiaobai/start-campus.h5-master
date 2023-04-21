<template>
    <div class="container">
        <van-nav-bar title="消息中心">
            <template #right>
                <svg class="icon iconfont" aria-hidden="true" @click="allReadSystemMessage">
                    <use xlink:href="#icon-saozhou_duose_"></use>
                </svg>
            </template>
        </van-nav-bar>
        <van-tabs v-model:active="data.active" shrink @click-tab="onClickTab">
            <van-tab title="聊天">
                <template #title>
                    聊天
                </template>
                <van-empty description="暂无记录"  v-if="data.chatUserList.length === 0" />
                <div class="page-body" v-for="chatUser in data.chatUserList" :key="chatUser.sendUserUuid">
                    <div class='item' @click="toChat(chatUser.sendUserUuid)">
                        <van-badge dot position="top-left" v-if="chatUser.isExitsNoRead === true">
                            <van-image round class='poster' :src="chatUser.sendUserAvatar"></van-image>
                        </van-badge>
                        <van-badge v-else>
                            <van-image round class='poster' :src="chatUser.sendUserAvatar"></van-image>
                        </van-badge>
                        <div class='meta'>
                            <span class='title'>{{ chatUser.sendUserName }}</span>
                            <span class='sub-title'>{{ chatUser.signature }}</span>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab title="系统">
                <template #title>
                    系统
                </template>
                <van-empty description="暂无记录"  v-if="data.systemMessages.length === 0" />
                <van-list
                    v-model="data.loading"
                    :finished="data.finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <van-swipe-cell  v-for="systemMessage in data.systemMessages" :key="systemMessage.uuid">
                        <van-cell
                            :title="systemMessage.messageTypeName"
                            :value="systemMessage.createTime"
                            @click="viewSystemMessage(systemMessage)">
                            <template #right-icon>
                                <van-badge dot v-if="!systemMessage.isRead"/>
                            </template>
                            <template #label>
                                <div class="content">
                                    {{systemMessage.content}}
                                </div>
                            </template>
                        </van-cell>
                        <template #right>
                            <van-button square type="danger" text="删除" class="delete-button" @click="deleteSystemMessage(systemMessage.uuid)" />
                        </template>
                    </van-swipe-cell>
                </van-list>
                <div style="height: var(--van-tabbar-height)"></div>
            </van-tab>
        </van-tabs>
        <tabbar-index :active-index="2"/>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {pageListChatMessage} from "@/api/chat/chatMessage";
import TabbarIndex from "../../components/tabbar/tabbarIndex";
import {useRouter} from 'vue-router'
import {page, singleRead, allRead,deleted} from "@/api/systemMessage/systemMessage";

const commonUtil = require('../../utils/common');
import {Dialog,Notify} from "vant";

export default {
    name: "chatMessage",
    components: {TabbarIndex},
    setup() {
        const searchParam = reactive({
            page: 1,
            size: 10
        })
        const data = reactive({
            chatUserList: [],
            total: 0,
            active: 0,
            systemMessages: [],
            loading: false,
            finished: false,
        })
        const router = useRouter();
        const systemMessageSearchParam = {
            page: 0,
            size: 10
        }
        /**
         * 分页查询聊天列表
         * @returns {Promise<void>}
         */
        const pageListChatUser = async () => {
            pageListChatMessage(searchParam).then(res => {
                data.chatUserList = res.data.records
                data.total = res.data.total
            })
        }
        /**
         * 跳转到聊天界面
         * @param uuid
         * @returns {Promise<void>}
         */
        const toChat = async (uuid) => {
            await router.push({
                path: '/chatMessage/chat',
                query: {publishUserUuid: uuid}
            })
        }
        const pageSearchSystemMessage = () => {
            page(systemMessageSearchParam).then(res => {
                const result = res.data.records
                if (result.length < systemMessageSearchParam.size) {
                    data.finished = true;
                }
                result.forEach(item => {
                    const systemMessageType = commonUtil.systemMessageType.find(messageType => {
                        return messageType.value === item.messageType
                    })
                    item.messageTypeName = systemMessageType.text
                })
                data.systemMessages = data.systemMessages.concat(result)
            })
        }
        /**
         * 加载
         */
        const onLoad = () => {
            systemMessageSearchParam.page++
            pageSearchSystemMessage()
        }
        /**
         * 查看消息
         */
        const viewSystemMessage = (systemMessage) => {
            Dialog.alert({
                title: systemMessage.messageTypeName,
                message: systemMessage.content,
                theme: 'round-button',
            }).then(() => {
                if (!systemMessage.isRead) {
                    // 未读调用接口
                    singleRead(systemMessage.uuid).then(() => {
                    })
                    systemMessage.isRead = true
                }
            });
        }
        /**
         * 点击切换tab
         */
        const onClickTab = () => {

        }
        /**
         * 系统消息全部已读
         */
        const allReadSystemMessage = () => {
            allRead().then(() => {
                Notify({type: 'success', message: '系统消息已全读', duration: 1000});
                data.systemMessages = []
                systemMessageSearchParam.page = 0;
                onLoad()
            })
        }
        /**
         * 删除系统消息
         */
        const deleteSystemMessage = (uuid) =>{
            deleted(uuid).then(() => {
                Notify({type: 'success', message: '删除成功', duration: 1000});
                data.systemMessages = []
                systemMessageSearchParam.page = 0;
                onLoad()
            })
        }
        onMounted(() => {
            pageListChatUser()
        })
        return {
            data,
            toChat,
            onLoad,
            viewSystemMessage,
            onClickTab,
            allReadSystemMessage,
            deleteSystemMessage
        }
    }
}
</script>

<style scoped>
.container {
    padding: 0px;
}

.page-header {
    display: flex;
    justify-content: center;
    width: 100%;
    border-bottom: 1px solid #ccc;
}

.page-title {
    padding: 10px 40px;
    color: #999;
    font-size: 38px;
    text-align: center;
}

.page-body {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
}

.item {
    display: flex;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.item .poster {
    width: 60px;
    height: 60px;
    margin-right: 10px;
}

.item .meta {
    flex: 1;
}

.item .meta .title,
.item .meta .sub-title {
    display: block;
    margin-bottom: 5px;
}

.item .meta .title {
    font-size: 15px;
}

.item .meta .sub-title {
    font-size: 10px;
    color: #c0c0c0;
}

.item .meta .artists {
    font-size: 13px;
    color: #999;
}

.item .rating {
    font-size: 14px;
    font-weight: bold;
    color: #f74c31;
}

.tips {
    font-size: 14px;
    text-align: center;
    padding: 50px;
    color: #ccc;
}

.tips image {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.tips image,
.tips text {
    vertical-align: middle;
}
.delete-button{
    height: 100%;
}
/*.content {*/
/*    display: -webkit-box; !*设置为弹性盒子*!*/
/*    -webkit-line-clamp: 2; !*最多显示2行*!*/
/*    overflow: hidden; !*超出隐藏*!*/
/*    text-overflow: ellipsis; !*超出显示为省略号*!*/
/*    -webkit-box-orient: vertical;*/
/*    word-break: break-all; !*强制英文单词自动换行*!*/
/*}*/
</style>