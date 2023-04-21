<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell>
            <template #value>
                <van-cell-group inset>
                    <van-notice-bar
                        wrapable
                        :scrollable="false"
                    >
                        <template #default>
                            <span>您的举报我们将尽快处理，核实后我们将第一时间告知受理结果，请尽量提交完整的举报理由和材料</span>
                        </template>
                    </van-notice-bar>
                </van-cell-group>
            </template>
        </van-cell>
        <van-cell>
            <template #value>
                <van-form @submit="submitReport">
                    <van-cell-group inset>
                        <van-field
                            required
                            v-model="data.commentReportTypeName"
                            is-link
                            readonly
                            label="举报类型"
                            placeholder="请选择举报类型"
                            @click="showCommentReportType"
                            :rules="[{ required: true, message: '请选择举报类型' }]"
                        />
                        <van-popup v-model:show="data.commentReportTypeShow" round position="bottom">
                            <van-picker
                                :columns="data.commentReportTypes"
                                @cancel="data.commentReportTypeShow = false"
                                @confirm="onConfirmSelectCommentReportType"
                            />
                        </van-popup>
                        <van-field
                            v-model="commentReportRo.reportReason"
                            rows="4"
                            autosize
                            label="举报理由"
                            type="textarea"
                            placeholder="详细描述举报理由"
                        />
                        <van-field name="uploader" label="相关图片">
                            <template #input>
                                <van-uploader :after-read="afterRead" v-model="data.imageList"
                                              :max-size="10240 * 1024"
                                              @oversize="onOversize" @delete="deleteImage" multiple/>
                            </template>
                        </van-field>
                    </van-cell-group>
                    <div style="margin: 20px;">
                        <van-button round block type="primary" native-type="submit">
                            提交
                        </van-button>
                    </div>
                </van-form>
            </template>
        </van-cell>
        <upload-image-loading :show-loading="uploadShow"/>
    </div>
</template>

<script>
import Navbar from "@/components/navbar/navbar";
import {onMounted, reactive, ref} from "vue";
import {list} from "@/api/commentReport/commentReportType";
import {useRoute} from "vue-router";
import {add} from "@/api/commentReport/commentReport";
import {Notify} from "vant";
import {uploadImage} from "@/api/upload/upload";
import UploadImageLoading from "@/components/upload/uploadImageLoading";

export default {
    components: {Navbar, UploadImageLoading},
    setup() {
        const data = reactive({
            navbarTitle: '评论举报',
            navbarPath: 'previous',
            commentReportTypeShow: false,
            commentReportTypes: [],
            commentReportTypeName: ''
        })
        // const router = useRouter();
        const route = useRoute();
        const commentReportRo = {
            reportedUserUuid: route.query.reportedUserUuid,
            reportReason: '',
            commentReportTypeUuid: '',
            reportImages: []
        }
        const uploadShow = ref(false)
        /**
         * 展示评论举报类型
         */
        const showCommentReportType = () => {
            data.commentReportTypeShow = true
        }
        /**
         * 获取全部评论举报类型
         */
        const listCommentReportType = () => {
            list().then(res => {
                res.data.forEach(commentReportType => {
                    data.commentReportTypes.push({
                        uuid: commentReportType.uuid,
                        text: commentReportType.name
                    })
                })
            })
        }
        /**
         * 确认选择评论举报类型
         * @param value
         */
        const onConfirmSelectCommentReportType = (value) => {
            data.commentReportTypeName = value.text
            data.commentReportTypeShow = false
            commentReportRo.commentReportTypeUuid = value.uuid
        }
        /**
         * 提交举报
         */
        const submitReport = () => {
            add(commentReportRo).then(() => {
                Notify({type: "success", message: "举报成功，等待审核", duration: 1000});
                history.back()
            })
        }
        /**
         * 上传图片的方法
         * @param file
         */
        const uploadImageFunction = (file) => {
            // 声明form表单数据
            const formData = new FormData();
            formData.append("image", file.file);
            return uploadImage(formData).then(res => {
                commentReportRo.reportImages.push(res.data)
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
        onMounted(() => {
            listCommentReportType()
        })
        return {
            data,
            commentReportRo,
            uploadShow,
            showCommentReportType,
            listCommentReportType,
            onConfirmSelectCommentReportType,
            submitReport,
            afterRead,
            onOversize
        }
    }
}
</script>