<template>
    <div class="container">
        <navbar :title="data.publishUserInfo.nickName" :path="data.navbarPath"/>
        <van-pull-refresh v-model="data.loading" @refresh="onRefresh">
            <div v-for="chatMessage in data.chatMessages" :key="chatMessage.uuid">
                <div v-if="chatMessage.sendUserUuid !== data.userInfo.uuid" >
                    <div class="time">{{ chatMessage.createTime }}</div>
                    <div class="comm-block left">
                        <van-image
                            round
                            width="40"
                            height="40"
                            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                            class="avatar"
                        />
                        <div class="content">
                            {{ chatMessage.content }}
                        </div>
                    </div>
                </div>
                <div v-if="chatMessage.sendUserUuid === data.userInfo.uuid">
                    <div class="time">{{ chatMessage.createTime }}</div>
                    <div class="comm-block right">
                        <van-image
                            round
                            width="40"
                            height="40"
                            :src="data.userInfo.avatar"
                            class="avatar"
                        />
                        <div class="content">
                            {{ chatMessage.content }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <van-field v-model="data.content" placeholder="请输入内容" class="message-input"/>
                <img src="../../assets/static/image/icon_send.png" class="icon-send" @click="sendMessage"/>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {getUserInfo} from "@/utils/auth";
import {pageHistory} from "@/api/chat/chatMessage";
import {getByUserUuid} from '@/api/user/user'
import Navbar from "@/components/navbar/navbar";

const commonUtil = require('../../utils/common');
let socket
export default {
    name: "chat",
    components: {Navbar},
    setup() {
        const route = useRoute();
        const data = reactive({
            navbarPath: '/chatMessage/index',
            publishUserUuid: route.query.publishUserUuid,
            // 房间id使用双方用户的uuid拼接
            roomId: route.query.publishUserUuid + "-" + getUserInfo().uuid,
            sendUserUuid: getUserInfo().uuid,
            userInfo: getUserInfo(),
            chatMessages: [],
            content: '',
            loading: false,
            publishUserInfo: '',
            charSocketUrl: process.env.VUE_APP_CURRENTMODE === 'development' ? 'ws://localhost:8002' : 'ws://192.168.1.2:8002'
        })
        const searchParam = reactive({
            page: 1,
            size: 10,
            sendUserUuid: '',
            receiveUserUuid: ''
        })
        const container = ref(null);
        const init = async () => {
            if (typeof (WebSocket) === 'undefined') {
                console.log("您的浏览器不支持WebSocket");
            } else {
                console.log("您的浏览器支持WebSocket");
                let socketUrl = data.charSocketUrl + "/chat/websocket/one2one/" + data.sendUserUuid + "/" + data.roomId;
                if (socket != null) {
                    socket.close()
                    socket = null;
                }
                socket = new WebSocket(socketUrl)
                socket.onopen = function () {
                    console.log("websocket已打开")
                }
                socket.onmessage = function (msg) {
                    const result = JSON.parse(msg.data)
                    const chatMessage = {
                        sendUserUuid: result.sendUserUuid,
                        sendUserAvatar: result.sendUserAvatar,
                        receiveUserUuid: result.receiveUserUuid,
                        content: result.content,
                        contentType: result.contentType,
                        createTime: result.createTime
                    }
                    data.chatMessages.push(chatMessage);
                    scroll()
                }
            }
        }
        /**
         * 获取历史聊天记录
         * @returns {Promise<void>}
         */
        const pageSearchHistoryChatMessage = async () => {
            searchParam.sendUserUuid = data.userInfo.uuid
            searchParam.receiveUserUuid = data.publishUserUuid
            pageHistory(searchParam).then(res => {
                const records = res.data.records
                data.chatMessages = records
            })
        }
        /**
         * 发送消息
         * @returns {Promise<void>}
         */
        const sendMessage = async () => {
            const sendParam = {
                content: data.content,
                sendUserUuid: data.sendUserUuid,
                receiveUserUuid: data.publishUserUuid,
                roomId: data.roomId,
                contentType: 1,
                requestId: commonUtil.generateRequestId()
            }
            socket.send(JSON.stringify(sendParam))
            data.content = ''
            scroll()
        }
        const scroll = () => {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }, 200)
        }
        /**
         * 下拉刷新
         */
        const onRefresh = () => {
            searchParam.page = searchParam.page + 1
            setTimeout(() => {
                pageSearchHistoryChatMessage();
                data.loading = false
            }, 1000);
        }
        /**
         * 获取发布者用户信息
         */
        const getUserByUserUuid = () => {
            getByUserUuid(data.publishUserUuid).then(res => {
                data.publishUserInfo = res.data
            })
        }
        onMounted(() => {
            init()
            pageSearchHistoryChatMessage()
            scroll()
            getUserByUserUuid()
        })
        return {
            data,
            container,
            sendMessage,
            onRefresh,
        }
    }
}
</script>

<style scoped>
.container {
    padding-bottom: 100px;
}

.time {
    text-align: center;
    padding: 10px 0;
}

.comm-block {
    display: flex;
    padding: 0 12px;
}

.comm-block.right {
    flex-direction: row-reverse;
}

.right .content {
    margin-right: 10px;
    margin-left: 0;
    background-color: antiquewhite;
}

.content {
    background-color: #94ede2;
    border-radius: 10px;
    /*flex: 1;*/
    padding: 10px;
    margin-left: 10px;
    word-break: break-all;
}

.avatar {
    flex: 0 0 40px;
}

.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.block {
    width: 120px;
    height: 120px;
}

.footer {
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
}

.icon-send {
    width: 24px;
    height: 24px;
    padding: 0 20px;
}

.message-input {
    border-radius: 30px;
    margin-left: 20px;
}
</style>