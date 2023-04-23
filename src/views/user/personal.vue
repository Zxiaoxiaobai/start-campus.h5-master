<template>
    <div>
        <header>
            <van-uploader :after-read="afterRead" :max-count="1" :max-size="5120 * 1024" @oversize="onOversize">
                <div>
                    <van-image style="width: 100%;height:250px;" :src="data.userInfo.backgroundImage"/>
                </div>
            </van-uploader>
        </header>
        <div class="info">
            <van-image class="img" round :src="data.userInfo.avatar"/>
            <p class="info_name">
                <van-space>
                    <span>{{ data.userInfo.nickName }}</span>
                    <span>{{data.userInfo.ipaddress}}</span>
                </van-space>
            </p>
            <p class="info_text">{{ data.userInfo.signature }}</p>
            <div class="info_item" @click="toFollow">
                <p>{{ data.userInfo.followCount }}</p>
                <p>关注</p>
            </div>
            <div class="info_item" @click="toFan">
                <p>{{ data.userInfo.followedCount }}</p>
                <p>粉丝</p>
            </div>
            <div class="info_item" @click="toDynamic">
                <p>{{ data.userInfo.dynamicCount }}</p>
                <p>动态</p>
            </div>
        </div>

        <div class="iconCon">
            <div @click="toMyCommodity">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shangpin1"></use>
                </svg>
                <p>闲置商品</p>
            </div>
            <div @click="toLostFoundItem">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shiwuzhaoling"></use>
                </svg>
                <p>失物招领</p>
            </div>
            <div @click="toMyConfessionalWall">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-biaobaiqiang"></use>
                </svg>
                <p>我的表白</p>
            </div>
            <div @click="toMyCircle">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-luntan"></use>
                </svg>
                <p>我的圈子</p>
            </div>
        </div>

        <div class="ui-table">
            <van-cell is-link @click="toFeedback">
                <template #title>
                    <van-space :size="5">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-fankuixinxi"></use>
                        </svg>
                        <span>我要反馈</span>
                    </van-space>
                </template>
            </van-cell>
            <van-cell is-link @click="toSet">
                <template #title>
                    <van-space :size="5">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shezhi"></use>
                        </svg>
                        <span>设置</span>
                    </van-space>
                </template>
            </van-cell>
<!--            <van-cell is-link @click="toContactAdmin">-->
<!--                <template #title>-->
<!--                    <van-space :size="5">-->
<!--                        <svg class="icon" aria-hidden="true">-->
<!--                            <use xlink:href="#icon-lianxikefu"></use>-->
<!--                        </svg>-->
<!--                        <span>在线客服</span>-->
<!--                    </van-space>-->
<!--                </template>-->
<!--            </van-cell>-->
        </div>
        <tabbar-index :active-index="3"/>
        <upload-image-loading :show-loading="uploadShow"/>
    </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {setUserInfo} from "@/utils/auth";
import {useRouter} from 'vue-router'
import TabbarIndex from "../../components/tabbar/tabbarIndex";
import {currentUserInfo, updateBackgroundImage} from "@/api/user/user";
import {uploadImage} from "@/api/upload/upload";
import {Notify} from "vant";
import UploadImageLoading from "@/components/upload/uploadImageLoading";

export default {
    name: "personal",
    components: {TabbarIndex, UploadImageLoading},
    setup() {
        const data = reactive({
            userInfo: '',
            image: require('../../assets/static/image/二手商品.png'),
        })
        const router = useRouter();
        const uploadShow = ref(false);
        /**
         * 跳转到设置
         * @returns {Promise<void>}
         */
        const toSet = async () => {
            await router.push("/user/set")
        }
        /**
         * 跳转到我的商品
         * @returns {Promise<void>}
         */
        const toMyCommodity = async () => {
            await router.push("/user/commodity")
        }
        /**
         * 跳转到登录页面
         * @returns {Promise<void>}
         */
        const toLogin = async () => {
            await router.push("/login")
        }
        /**
         * 跳转到我要反馈
         * @returns {Promise<void>}
         */
        const toFeedback = async () => {
            await router.push("/user/feedback")
        }
        /**
         * 跳转到我的失物招领
         * @returns {Promise<void>}
         */
        const toLostFoundItem = async () => {
            await router.push("/user/lostFoundItem")
        }
        /**
         * 跳转到首页
         */
        const toHome = () => {
            router.push("/")
        }
        /**
         * 跳转到关注列表
         */
        const toFollow = () => {
            router.push("/user/follow")
        }
        /**
         * 跳转到动态列博熬
         */
        const toDynamic = () => {
            router.push("/user/dynamic")
        }
        /**
         * 上传图片
         * @param file
         */
        const afterRead = (file) => {
            uploadShow.value = true
            // 声明form表单数据
            const formData = new FormData();
            formData.append("image", file.file);
            uploadImage(formData).then(res => {
                data.userInfo.backgroundImage = res.data
                setUserInfo(data.userInfo)
                // 执行修改背景图
                const updateBackgroundImageRo = {
                    backgroundImage: res.data
                }
                updateBackgroundImage(updateBackgroundImageRo).then(() => {
                    Notify({type: 'success', message: '背景图上传成功'});
                })
            }).finally(() => {
                uploadShow.value = false
            })
        }
        /**
         * 背景图最大为5M
         */
        const onOversize = () => {
            Notify({type: 'danger', message: '背景图大小不能超过5M'});
        }
        /**
         * 跳转到我的表白墙
         */
        const toMyConfessionalWall = () => {
            router.push("/user/confessionalWall")
        }
        /**
         * 跳转到我的圈子
         */
        const toMyCircle = () => {
            router.push("/user/circle")
        }
        /**
         * 跳转到粉丝列表
         */
        const toFan = () => {
            router.push("/user/fan")
        }
        /**
         * 跳转到联系管理员
         */
        const toContactAdmin = () => {
            router.push("/user/contactAdmin")
        }
        onMounted(() => {
            currentUserInfo().then(res => {
                setUserInfo(res.data)
                data.userInfo = res.data
            })
        })
        return {
            data,
            uploadShow,
            toSet,
            toMyCommodity,
            toLogin,
            toFeedback,
            toLostFoundItem,
            toHome,
            toFollow,
            afterRead,
            toMyConfessionalWall,
            toDynamic,
            toMyCircle,
            onOversize,
            toFan,
            toContactAdmin
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    font-family: "微软雅黑";
}

header {
    /*!* 头部包含背景图 *!*/
    /*background-color: #fbff83;*/
    width: 100%;
    overflow: hidden;
    /*height: 160px;*/
}

header > p {
    /* 放我的和关机图标 */
    height: 50px;
    line-height: 50px;
}

header > p > span:nth-of-type(1) {
    display: inline-block;
    float: left;
    padding-left: 16px;
    font-size: 18px;
    font-weight: bold;
}

header > p > span:nth-of-type(2) {
    display: inline-block;
    float: right;
    padding-right: 16px;
}

header > p > span:nth-of-type(2) > i {
    font-size: 18px;
    font-weight: bold;
}


.info {
    /* 存放个人信息的 */
    width: calc(100% - 32px);
    background-color: #FFFFFF;
    margin-left: 16px;
    margin-top: -30px;
    float: left;
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(255, 218, 25, 0.6);
    position: relative;
}

.info > .img {
    width: 66px;
    height: 66px;
    border-radius: 66px;
    margin: 0 auto;
    display: block;
    margin-top: -33px;
    border: 1px solid #ffda19;
}

.info_name {
    text-align: center;
    font-size: 16px;
    color: #444444;
    height: 30px;
    line-height: 30px;
}

.info_text {
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #6F6F6F;
}

.info_item {
    width: calc(100% / 3);
    float: left;
    text-align: center;
    padding: 4px 0;
}

.info_item > p:nth-of-type(1) {
    font-size: 12px;
}

.info_item > p:nth-of-type(2) {
    font-size: 14px;
    color: #6F6F6F;
}

.info_item:nth-of-type(1) {
    border-radius: 0 0 0 8px;
}

.info_item:nth-last-of-type(1) {
    border-radius: 0 0 8px 0;
}

.iconCon {
    /* 放功能的图标 */
    width: 100%;
    float: left;
    overflow: hidden;
    margin-top: 16px;
    padding: 20px 0;
}

.iconCon > div {
    float: left;
    width: calc(100% / 4);
    text-align: center;

}

.ui-table {
    float: left;
    width: calc(100% - 64px);
    background-color: #FFFFFF;
    border-top: 8px solid #EFEFF4;
    padding: 0 32px;
}

.ui-table > div {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #EFEFF4;
}

.ui-table > div > span {
    float: left;
}

.ui-table > div > i {
    float: right;
}

.icon_comment {
    border-radius: 100px;
    font-size: 20px;
    width: 30px;
    height: 30px;
    display: inline-block;
    line-height: 30px;
    color: #FFFFFF;
}

.icon-xiezuo {
    background-color: #fbdc58;
}

.icon-tupian {
    background-color: #94ede2;
}

.icon-yinyue {
    background-color: #bceccd;
}

.icon-shipin {
    background-color: #ffbadc;
}

:deep(.van-uploader__wrapper) {
    flex-direction: column;
}

:deep(.van-uploader) {
    display: block;
}

:deep(.van-image__img) {
    object-fit: cover;
}
</style>