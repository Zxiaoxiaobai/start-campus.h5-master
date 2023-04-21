<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell-group>
            <van-cell>
                <template #value>
                    <van-notice-bar
                        wrapable
                        :scrollable="false"
                    >
                        <template #default>
                            <span style="display: flex">表白墙发布须知：</span>
                            <span style="display: flex">1，只能发布和表白相关内容，否则不予审核</span>
                            <span style="display: flex">2，发布文字不能出现敏感词汇</span>
                            <span style="display: flex">3，不能出现敏感图片</span>
                            <span style="display: flex">4，图片最大为10M</span>
                        </template>
                    </van-notice-bar>
                </template>
            </van-cell>
        </van-cell-group>
        <van-form @submit="submitPublish">
            <van-cell-group inset>
                <van-field v-model="publishParam.content" required rows="2" autosize label="内容"
                           type="textarea"
                           maxlength="50"
                           placeholder="爱就要大声说出来" show-word-limit
                           :rules="[{ required: true, message: '请输入你想说的话' }]"/>
                <van-field name="images" label="图片（选填）">
                    <template #input>
                        <van-uploader :after-read="afterRead" v-model="data.imageList" :max-count="6" :max-size="10240 * 1024"
                                      @oversize="onOversize" @delete="deleteImage" multiple/>
                    </template>
                </van-field>
                <van-field name="switch" label-width="100px" label="是否开启评论" required
                           :rules="[{ validator: checkSelectIsOpenComment }]">
                    <template #input>
                        <van-switch v-model="publishParam.isOpenComment" size="20" @change="changeIsOpenComment"/>
                    </template>
                </van-field>
                <van-field name="switch" label-width="100px" label="同步自由广场" required
                           :rules="[{ validator: checkSelectIsSyncLibertySquare }]">
                    <template #input>
                        <van-space>
                            <van-switch v-model="publishParam.isSyncLibertySquare" size="20"
                                        @change="changeIsSyncLibertySquare"/>
                            <van-popover v-model:show="data.showSyncLibertySquareQuestion" placement="top">
                                同步到自由广场后，各个学校的都可以浏览你发布的表白
                                <template #reference>
                                    <van-icon name="question" size="20"/>
                                </template>
                            </van-popover>
                        </van-space>
                    </template>
                </van-field>
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>
        <upload-image-loading :show-loading="uploadShow"/>
    </div>
</template>

<script>
import {reactive, ref} from 'vue'
import {uploadImage} from "@/api/upload/upload";
import {Notify} from "vant";
import {publish} from '@/api/confessionalWall/confessionalWall';
import UploadImageLoading from '@/components/upload/uploadImageLoading'
import {useRouter} from "vue-router";
import Navbar from "@/components/navbar/navbar";

export default {
    name: 'confessionalWallPublish',
    components: {UploadImageLoading, Navbar},
    setup() {
        const uploadShow = ref(false);
        const data = reactive({
            navbarTitle: '发布表白墙',
            navbarPath: '/confessionalWall/index',
            imageList: [],
            showSyncLibertySquareQuestion: false
        })
        const publishParam = reactive({
            content: '',
            images: [],
            isOpenComment: true,
            isSyncLibertySquare: false,
        })
        const router = useRouter();
        /**
         * 上传图片的方法
         * @param file
         */
        const uploadImageFunction = (file) => {
            // 声明form表单数据
            const formData = new FormData();
            formData.append("image", file.file);
            return uploadImage(formData).then(res => {
                publishParam.images.push(res.data)
            })
        }
        /**
         * 上传图片
         * @param files
         */
        const afterRead = (files) => {
            const imageFiles = []
            if (files instanceof Array) {
                files.forEach(file => {
                    imageFiles.push(file)
                })
            } else {
                imageFiles.push(files)
            }
            uploadShow.value = true
            const uploadImages = []
            imageFiles.forEach(file => {
                uploadImages.push(uploadImageFunction(file))
            })
            Promise.all(uploadImages).then(() => {
                Notify({type: 'success', message: '上传成功'});
            }).finally(() => {
                uploadShow.value = false
            })
        }
        /**
         * 图片上传限制
         * @param file
         */
        const onOversize = () => {
            Notify({type: 'danger', message: '图片最大为10M'});
        };
        /**
         * 发布表白墙
         */
        const submitPublish = async () => {
            publish(publishParam).then(() => {
                Notify({type: 'success', message: '发布成功'});
                publishParam.content = ''
                publishParam.images = []
                setTimeout(function () {
                    router.push("/user/confessionalWall")
                }, 2000)
            })
        }
        /**
         * 选择是否开启评论
         * @param value
         */
        const changeIsOpenComment = (value) => {
            publishParam.isOpenComment = value
        }
        const checkSelectIsOpenComment = () => {
            if (publishParam.isOpenComment === '' || publishParam.isOpenComment === undefined) {
                return "请选择是否开启评论"
            }
        }
        /**
         * 删除图片
         */
        const deleteImage = (file, detail) => {
            publishParam.images.splice(detail.index, 1)
        }
        /**
         * 校验是否选择同步到自由广场
         * @returns {string}
         */
        const checkSelectIsSyncLibertySquare = () => {
            if (publishParam.isSyncLibertySquare === '' || publishParam.isSyncLibertySquare === undefined) {
                return "请选择是否同步到自由广场"
            }
        }
        /**
         * 选择是否同步到自由广场
         * @param value
         */
        const changeIsSyncLibertySquare = (value) => {
            publishParam.isSyncLibertySquare = value
        }
        return {
            data,
            publishParam,
            uploadShow,
            afterRead,
            onOversize,
            submitPublish,
            changeIsOpenComment,
            checkSelectIsOpenComment,
            deleteImage,
            checkSelectIsSyncLibertySquare,
            changeIsSyncLibertySquare
        }
    }
}
</script>

<style>

</style>
<style>
.icon-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 18px;
}

.icon-wrapper .van-icon-success {
    line-height: 32px;
    color: var(--van-blue);
}

.icon-wrapper .van-icon-cross {
    line-height: 32px;
    color: var(--van-gray-5);
}
</style>
