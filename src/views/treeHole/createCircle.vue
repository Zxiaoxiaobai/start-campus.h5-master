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
                            <span style="display: flex">圈子创建须知：</span>
                            <span style="display: flex">1，文字不能出现敏感词汇</span>
                            <span style="display: flex">2，不能出现敏感图片</span>
                            <span style="display: flex">3，头像不能超过5M</span>
                            <span style="display: flex">4，需要为圈子添加5个标签</span>
                        </template>
                    </van-notice-bar>
                </van-cell-group>
            </template>
        </van-cell>
        <van-steps :active="active">
            <van-step>基本信息</van-step>
            <van-step>设置标签</van-step>
        </van-steps>
        <!-- 基本信息填写 -->
        <van-form @submit="nextStep" v-if="active === 0">
            <van-field  name="uploader" label="头像" required :rules="[{required:true,message:'请上传头像'}]">
                <template #input>
                    <van-uploader :after-read="afterRead" :max-size="5120 * 1024" :max-count="1"
                                  @oversize="onOversize" v-model="data.imageList"/>
                </template>
            </van-field>
            <van-field
                required
                v-model="createRo.title"
                label="圈子标题"
                rows="2"
                autosize
                placeholder="给圈子取个标题吧"

                :rules="[{ required: true, message: '请填写圈子标题' }]"
            />
            <van-field
                required
                label="描述"
                v-model="createRo.description"
                rows="2"
                autosize
                type="textarea"
                maxlength="50"
                placeholder="圈子简单描述"
                show-word-limit
                :rules="[{ required: true, message: '请填写圈子描述' }]"
            />
            <div style="margin-top: 16px; text-align: center">
                <van-button type="primary" native-type="submit" size="small" v-if="active === 0">
                    下一步
                </van-button>
            </div>
        </van-form>
        <!-- 标签设置填写 -->
        <van-form v-if="active === 1" @submit="createCircle">
            <van-field v-model="data.labelOne" placeholder="请输入标签1"
                       :rules="[{ required: true, message: '请输入标签1' }]"/>
            <van-field v-model="data.labelTwo" placeholder="请输入标签2"
                       :rules="[{ required: true, message: '请输入标签2' }]"/>
            <van-field v-model="data.labelThree" placeholder="请输入标签3"
                       :rules="[{ required: true, message: '请输入标签3' }]"/>
            <van-field v-model="data.labelFour" placeholder="请输入标签4"
                       :rules="[{ required: true, message: '请输入标签4' }]"/>
            <van-field v-model="data.labelFive" placeholder="请输入标签5"
                       :rules="[{ required: true, message: '请输入标签5' }]"/>
            <div style="text-align: center">
                <van-space :size="30">
                    <van-button type="primary" size="small" @click="previousStep"
                                v-if="active === 1">
                        上一步
                    </van-button>
                    <van-button type="primary" native-type="submit" size="small"
                                v-if="active === 1">
                        提交审核
                    </van-button>
                </van-space>
            </div>
        </van-form>
        <upload-image-loading :show-loading="uploadShow"/>
    </div>
</template>
<script>
import {uploadImage} from "@/api/upload/upload";
import {reactive, ref} from "vue";
import {Notify} from "vant";
import {create} from "@/api/circle/circle";
import {useRouter} from "vue-router";
import UploadImageLoading from "@/components/upload/uploadImageLoading";
import Navbar from "@/components/navbar/navbar";

export default ({
    components: {UploadImageLoading, Navbar},
    setup() {
        const uploadShow = ref(false);
        const active = ref(0);
        const createRo = reactive({
            avatar: '',
            title: '',
            description: '',
            labels: []
        })
        const data = reactive({
            navbarTitle: '创建圈子',
            navbarPath: '/treeHole/circleSquare',
            labelOne: '',
            labelTwo: '',
            labelThree: '',
            labelFour: '',
            labelFive: '',
            imageList: []
        })
        const router = useRouter();
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
                createRo.avatar = res.data
                Notify({type: 'success', message: '上传成功'});
            }).finally(() => {
                uploadShow.value = false
            })
        }
        /**
         * 下一步
         */
        const nextStep = () => {
            active.value = 1
        }
        /**
         * 上一步
         */
        const previousStep = () => {
            active.value = 0
        }
        /**
         * 创建圈子
         */
        const createCircle = () => {
            // 先将labels清空
            createRo.labels = []
            createRo.labels.push(data.labelOne)
            createRo.labels.push(data.labelTwo)
            createRo.labels.push(data.labelThree)
            createRo.labels.push(data.labelFour)
            createRo.labels.push(data.labelFive)
            create(createRo).then(() => {
                Notify({type: 'success', message: '创建成功，等待审核'});
                router.push("/treeHole/circleSquare")
            })
        }
        /**
         * 圈子头像最大为5M
         */
        const onOversize = () => {
            Notify({type: 'danger', message: '头像大小不能超过5M'});
        }
        return {
            createRo,
            data,
            uploadShow,
            active,
            afterRead,
            nextStep,
            previousStep,
            createCircle,
            onOversize
        }
    }
})
</script>
<style>
.custom-title {
    margin-right: 4px;
    vertical-align: middle;
}
</style>