<template>
    <navbar :title="data.navbarTitle" :path="data.navbarPath" v-if="data.show"/>
    <div class="container">
        <div v-for="historyChatMessage in data.historyChatMessages" :key="historyChatMessage.uuid">
            <div v-if="historyChatMessage.sendUserUuid !== data.currentUserInfo.uuid">
                <div class="time">{{ historyChatMessage.sendTime }}</div>
                <div class="comm-block left">
                    <van-image
                        round
                        width="40"
                        height="40"
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                        class="avatar"
                    />
                    <div class="content">
                        {{ historyChatMessage.content }}
                    </div>
                </div>
            </div>
            <div v-if="historyChatMessage.sendUserUuid === data.currentUserInfo.uuid">
                <div class="time">{{ historyChatMessage.sendTime }}</div>
                <div class="comm-block right">
                    <van-image
                        round
                        width="40"
                        height="40"
                        :src="data.currentUserInfo.avatar"
                        class="avatar"
                    />
                    <div class="content">
                        {{ historyChatMessage.content }}
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <van-field v-model="data.content" placeholder="请输入用户名" class="message-input"/>
            <img src="../../assets/static/image/icon_send.png" class="icon-send" @click="sendMessage"/>
        </div>
        <van-overlay :show="data.showLoading">
            <div class="wrapper">
                <div class="block">
                    <!-- 只修改文案颜色 -->
                    <van-loading text-color="#0094ff">
                        客服连接中...
                    </van-loading>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<script>
import Navbar from "@/components/navbar/navbar";
import {onMounted, reactive} from "vue";
import {randomOne} from "../../api/admin/admin";
import {getUserInfo} from "../../utils/auth";
import {getChatRoom, pageHistory} from "../../api/contactAdmin/contactAdmin";
import {Dialog, Notify} from "vant";

let socket
export default {
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '',
            navbarPath: '/user/person',
            customerAdminInfo: '',
            currentUserInfo: getUserInfo(),
            show: false,
            historyChatMessages: [],
            showLoading: true,
            roomId: '',
            content: '',
            charSocketUrl: process.env.VUE_APP_CURRENTMODE === 'development' ? 'ws://localhost:8002' : 'ws://192.168.1.2:8002'
        })
        /**
         * 随机获取一名客服管理员
         */
        const randomOneCustomerAdmin = () => {
            data.customerAdminInfo = JSON.parse(window.sessionStorage.getItem("customerAdminInfo"))
            console.log(data.customerAdminInfo)
            if (data.customerAdminInfo != null) {
                data.showLoading = false
                data.navbarTitle = data.customerAdminInfo.loginName
                data.show = true
                // 获取聊天室信息
                getChatRoom(data.customerAdminInfo.uuid).then(res => {
                    data.roomId = res.data.uuid
                    init()
                    // 获取聊天历史记录信息
                    pageHistory(res.data.uuid).then(res => {
                        data.historyChatMessages = res.data.records
                    })
                })
            }else {
                randomOne().then(res => {
                    setTimeout(function () {
                        Dialog.alert({
                            title: '连接成功',
                            message: res.data.loginName + "为你服务",
                            theme: 'round-button',
                        }).then(() => {
                            data.showLoading = false
                            data.customerAdminInfo = res.data
                            data.navbarTitle = data.customerAdminInfo.loginName
                            data.show = true
                            window.sessionStorage.setItem("customerAdminInfo",JSON.stringify(data.customerAdminInfo))
                            // 获取聊天室信息
                            getChatRoom(data.customerAdminInfo.uuid).then(res => {
                                data.roomId = res.data.uuid
                                init()
                                // 获取聊天历史记录信息
                                pageHistory(res.data.uuid).then(res => {
                                    data.historyChatMessages = res.data.records
                                })
                            })
                        });
                    }, 2000)
                })
            }
        }
        /**
         * 初始化聊天
         */
        const init = () => {
            if (typeof (WebSocket) === 'undefined') {
                Notify({type: 'danger', message: '您的浏览器不支持WebSocket', duration: 1000});
            } else {
                let socketUrl = data.charSocketUrl + "/contactAdmin/websocket/one2one/" + data.currentUserInfo.uuid + "/" + data.roomId
                if (socket != null) {
                    socket.close()
                    socket = null
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
                        sendTime: result.createTime
                    }
                    data.historyChatMessages.push(chatMessage);
                    scroll()
                }
            }
        }
        /**
         * 发送消息
         * @returns {Promise<void>}
         */
        const sendMessage = async () => {
            const sendParam = {
                content: data.content,
                sendUserUuid: data.currentUserInfo.uuid,
                receiveUserUuid: data.customerAdminInfo.uuid,
                roomId: data.roomId,
                contentType: 1,
                isAdmin: false
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
        onMounted(() => {
            randomOneCustomerAdmin()
            scroll()
        })
        return {
            data,
            sendMessage
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