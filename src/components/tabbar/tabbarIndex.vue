<template>
    <div>
        <van-tabbar v-model="data.active" @change="onChange">
            <van-tabbar-item icon="home-o" @click="toHome">
                <template #icon>
                    <svg class="icon iconfont" aria-hidden="true">
                        <use xlink:href="#icon-fangwu"></use>
                    </svg>
                </template>
                首页
            </van-tabbar-item>
<!--            <van-tabbar-item icon="add-o" @click="toChatgpt" >-->
          <van-tabbar-item icon="add-o"  url="http://zrpxiaozhu.top/">
                <template #icon>
                    <svg class="icon iconfont" aria-hidden="true">
                        <use xlink:href="#icon-cansaitubiaozhuanqu-"></use>
                    </svg>
                </template>
                chatgpt助手
            </van-tabbar-item>
            <van-tabbar-item icon="add-o" @click="showPublishOption">
                <template #icon>
                    <svg class="icon iconfont" aria-hidden="true">
                        <use xlink:href="#icon-wodefabu"></use>
                    </svg>
                </template>
                发布
            </van-tabbar-item>
            <van-tabbar-item icon="chat-o" @click="toChatIndex" v-if="data.isExistsNoRead === true" dot>
                <template #icon>
                    <svg class="icon iconfont" aria-hidden="true">
                        <use xlink:href="#icon-xiaoxi"></use>
                    </svg>
                </template>
                消息
            </van-tabbar-item>
            <van-tabbar-item icon="chat-o" @click="toChatIndex" v-else>
                <template #icon>
                    <svg class="icon iconfont" aria-hidden="true">
                        <use xlink:href="#icon-xiaoxi"></use>
                    </svg>
                </template>
                消息
            </van-tabbar-item>
            <van-tabbar-item icon="manager-o" @click="toPersonal">
                <template #icon>
                    <svg class="icon iconfont" aria-hidden="true">
                        <use xlink:href="#icon-gerenzhongxin"></use>
                    </svg>
                </template>
                个人中心
            </van-tabbar-item>
        </van-tabbar>
        <van-popup v-model:show="data.show" position="bottom">
            <van-grid :column-num="3">
                <van-grid-item icon="bag-o" text="闲置商品" @click="toCommodityPublish">
                    <template #icon>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shangpin1"></use>
                        </svg>
                    </template>
                </van-grid-item>
                <van-grid-item icon="like-o" text="表白墙" @click="toConfessionWallPublish">
                    <template #icon>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-biaobaiqiang"></use>
                        </svg>
                    </template>
                </van-grid-item>
                <van-grid-item icon="records" text="失物招领" @click="toLostFoundItemPublish">
                    <template #icon>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shiwuzhaoling"></use>
                        </svg>
                    </template>
                </van-grid-item>
            </van-grid>
        </van-popup>
    </div>
</template>

<script>
import {reactive, onMounted} from "vue";
import {useRouter} from 'vue-router'
// import {isExitsNoReadChatMessage} from "@/api/chatMessage";
// import {isExitsNoReadSystemMessage} from "@/api/systemMessage";

export default {
    name: "tabbarIndex",
    props: {
        activeIndex: Number
    },
    setup(props) {
        const data = reactive({
            active: props.activeIndex,
            show: false,
            isExistsNoRead: ''
        })
        const router = useRouter();
        /**
         * 跳转到个人中心页面
         * @returns {Promise<void>}
         */
        const toPersonal = async () => {
            await router.push('/user/person')
        }
        /**
         * 展示发布选项
         * @returns {Promise<void>}
         */
        const showPublishOption = async () => {
            data.show = true
        }
        /**
         * 跳转到发布商品页面
         * @returns {Promise<void>}
         */
        const toCommodityPublish = async () => {
            router.push("/commodity/publish")
        }
      const toChatgpt = async () => {
         router.push("/chatgpt/ChatGpt")
      }
        /**
         * 跳转到发布失物招领页面
         * @returns {Promise<void>}
         */
        const toLostFoundItemPublish = async () => {
            router.push("/lostFoundItem/publish")
        }
        /**
         * 跳转到表白墙发布页面
         * @returns {Promise<void>}
         */
        const toConfessionWallPublish = async () => {
            router.push("/confessionalWall/publish")
        }
        /**
         * 跳转到首页
         */
        const toHome = () => {
            router.push("/")
        }
        /**
         * 跳转到消息列表
         */
        const toChatIndex = () => {
            router.push("/chatMessage/index")
        }
        const onChange = () => {
        }
        /**
         * 获取是否存在未读聊天
         * @returns {Promise<void>}
         */
        // const isExistsNoReadChat = async () => {
        //     isExitsNoReadChatMessage().then(res => {
        //         data.isExistsNoRead = res.data
        //     })
        // }
        // const isExistsNoReadSystem = async () => {
        //     isExitsNoReadSystemMessage().then(res => {
        //         data.isExistsNoRead = res.data
        //     })
        // }
        onMounted(() => {
            // setTimeout(function () {
            //     isExistsNoReadChat()
            //     isExistsNoReadSystem()
            // }, 2000)

        })
        return {
            data,
            toPersonal,
            showPublishOption,
            toCommodityPublish,
            toLostFoundItemPublish,
            toConfessionWallPublish,
            toHome,
            onChange,
            toChatIndex,
            toChatgpt
        }
    }
}
</script>

<style scoped>

</style>