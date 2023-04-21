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
                            <span style="display: flex">圈子修改须知：</span>
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
            <van-field name="uploader" label="头像" required>
                <template #input>
                    <van-uploader :after-read="afterRead" :max-size="5120 * 1024"
                                  @oversize="onOversize">
                        <van-image width="5rem" height="5rem" :src="createRo.avatar">
                            <template v-slot:loading>
                                头像
                            </template>
                        </van-image>
                    </van-uploader>
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
        <van-form v-if="active === 1" @submit="editCircle">
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
import {onMounted, reactive, ref} from "vue";
import {update, detail} from "@/api/circle/circle";
import {useRoute, useRouter} from "vue-router";
import UploadImageLoading from "@/components/upload/uploadImageLoading";
import {uploadImage} from "@/api/upload/upload";
import {Notify} from "vant";

export default {
    components: {UploadImageLoading},
    setup() {
        const route = useRoute();
        const router = useRouter();
        const uploadShow = ref(false);
        const active = ref(0);
        const data = reactive({
            navbarTitle: '编辑圈子',
            navbarPath: '/treeHole/circleSquare',
            circleDetail: '',
            labelOne: '',
            labelTwo: '',
            labelThree: '',
            labelFour: '',
            labelFive: '',
        })
        const createRo = reactive({
            avatar: '',
            title: '',
            description: '',
            labels: []
        })
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
         * 修改圈子
         */
        const editCircle = () => {
            // 先将labels清空
            createRo.labels = []
            createRo.labels.push(data.labelOne)
            createRo.labels.push(data.labelTwo)
            createRo.labels.push(data.labelThree)
            createRo.labels.push(data.labelFour)
            createRo.labels.push(data.labelFive)
            update(createRo, route.query.uuid).then(() => {
                Notify({type: 'success', message: '修改成功，等待审核', duration: 1000});
                router.push("/user/circle")
            })
        }
        onMounted(() => {
            detail(route.query.uuid).then(res => {
                createRo.title = res.data.title
                createRo.avatar = res.data.avatar
                createRo.description = res.data.description
                createRo.labels = res.data.circleLabels
                data.labelOne = res.data.circleLabels[0].replace("#", "")
                data.labelTwo = res.data.circleLabels[1].replace("#", "")
                data.labelThree = res.data.circleLabels[2].replace("#", "")
                data.labelFour = res.data.circleLabels[3].replace("#", "")
                data.labelFive = res.data.circleLabels[4].replace("#", "")
            })
        })
        return {
            data,
            uploadShow,
            createRo,
            active,
            afterRead,
            nextStep,
            previousStep,
            editCircle
        }
    }
}
</script>