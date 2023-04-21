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
                            <span style="display: flex">失物招领发布须知：</span>
                            <span style="display: flex">1.只能发布和失物招领相关，否则不予审核</span>
                            <span style="display: flex">2.发布文字不能出现敏感词汇</span>
                            <span style="display: flex">3.不能出现敏感图片</span>
                            <span style="display: flex">4.最多只能上传6张图片</span>
                            <span style="display: flex">5.联系方式要有效</span>
                            <span style="display: flex">6.图片最大为10M</span>
                        </template>
                    </van-notice-bar>
                </van-cell-group>
            </template>
        </van-cell>
        <van-form @submit="submitPublish">
            <van-cell-group inset>
                <van-field required name="type" label="发布类型"
                           :rules="[{ required: true, message: '请选择发布类型' }]"
                >
                    <template #input>
                        <van-radio-group v-model="publishParam.type" direction="horizontal">
                            <van-radio name="1" shape="square">拾取物品</van-radio>
                            <van-radio name="2" shape="square">丢失物品</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field
                    required
                    v-model="publishParam.name"
                    name="name"
                    label="物品名称"
                    placeholder="名称在1-16为之间哦"
                    :rules="[{ required: true, message: '请输入物品名称' }]"
                />
                <van-field
                    required
                    v-model="publishParam.description"
                    type="textarea"
                    name="description"
                    label="描述"
                    placeholder="简单描述物品特征"
                    :rules="[{ required: true, message: '请输入描述' }]"
                />
                <van-field
                    required
                    v-model="data.categoryName"
                    is-link
                    readonly
                    label="分类"
                    placeholder="选择分类"
                    @click="showCategory"
                    :rules="[{ required: true, message: '请选择分类' }]"
                />
                <van-popup v-model:show="data.categoryShow" round position="bottom">
                    <van-picker
                        :columns="data.categories"
                        @cancel="data.categoryShow = false"
                        @confirm="onConfirm"

                    />
                </van-popup>
                <van-field
                    required
                    v-model="publishParam.location"
                    name="location"
                    label="地点"
                    placeholder="请输入丢失或拾取地点"
                    :rules="[{ required: true, message: '请输入丢失或拾取地点' }]"
                />
                <van-field
                    required
                    v-model="publishParam.contactWay"
                    name="contactWay"
                    label="联系方式"
                    placeholder="微信/手机/QQ"
                    :rules="[{ required: true, message: '请输入微信/手机/QQ' }]"
                />
                <van-field required name="uploader" label="图片" :rules="[{ required: true, message: '请上传图片' }]">
                    <template #input>
                        <van-uploader :after-read="afterRead" v-model="data.imageList" :max-count="6"
                                      :max-size="10240 * 1024"
                                      @oversize="onOversize" @delete="deleteImage" multiple/>
                    </template>
                </van-field>
                <van-field name="switch" label-width="100px" label="同步自由广场" required
                           :rules="[{ validator: checkSelectIsSyncLibertySquare }]">
                    <template #input>
                        <van-space>
                            <van-switch v-model="publishParam.isSyncLibertySquare" size="20"
                                        @change="changeIsSyncLibertySquare"/>
                            <van-popover v-model:show="data.showSyncLibertySquareQuestion" placement="top">
                                同步到自由广场后，各个学校的都可以浏览你发布的失物招领
                                <template #reference>
                                    <van-icon name="question" size="20"/>
                                </template>
                            </van-popover>
                        </van-space>
                    </template>
                </van-field>
            </van-cell-group>
            <div style="margin: 20px;">
                <van-button round block type="primary" native-type="submit">
                    提交审核
                </van-button>
            </div>
        </van-form>
        <upload-image-loading :show-loading="uploadShow"/>
    </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {uploadImage} from "@/api/upload/upload";
import {Notify} from "vant";
import {publish} from "@/api/lostFoundItem/lostFoundItem";
import {useRouter} from 'vue-router'
import UploadImageLoading from "@/components/upload/uploadImageLoading";
import {all} from "@/api/plate/plate";
import {getByPlateUuid} from "@/api/category/category";
import Navbar from "@/components/navbar/navbar";

export default {
    name: "publish",
    components: {UploadImageLoading, Navbar},
    setup() {
        const uploadShow = ref(false);
        const publishParam = reactive({
            name: '',
            description: '',
            location: '',
            contactWay: '',
            type: '',
            imageUrls: [],
            categoryUuid: '',
            isSyncLibertySquare:false
        })
        const data = reactive({
            navbarTitle: '发布物品',
            navbarPath: '/lostFoundItem/index',
            imageList: [],
            plateName: '',
            categories: [],
            categoryName: '',
            categoryShow: false,
            showSyncLibertySquareQuestion: false
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
                publishParam.imageUrls.push(res.data)
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
         * 删除图片
         */
        const deleteImage = (file, detail) => {
            publishParam.imageUrls.splice(detail.index, 1)
        }
        /**
         * 提交发布
         * @returns {Promise<void>}
         */
        const submitPublish = async () => {
            publish(publishParam).then(() => {
                Notify({type: 'success', message: '提交成功，等待管理员审核'});
                setTimeout(function () {
                    router.push("/user/lostFoundItem")
                }, 2000)
            })
        }
        /**
         * 获取全部板块
         * @returns {Promise<void>}
         */
        const allPlate = async () => {
            all().then(res => {
                const plate = res.data.filter((plate) => {
                    return plate.code === 'lostFoundItem'
                });
                data.plateName = plate[0].name
                data.plateUuid = plate[0].uuid
                // 根据板块获取分类
                getByPlateUuid((data.plateUuid)).then(res => {
                    const categoryDatas = []
                    res.data.forEach(category => {
                        categoryDatas.push({
                            uuid: category.uuid,
                            text: category.name
                        })
                    });
                    data.categories = categoryDatas
                })
            })
        }
        /**
         * 显示分类
         * @returns {Promise<void>}
         */
        const showCategory = async () => {
            data.categoryShow = true;
        }
        /**
         * 确认选择分类
         * @param value
         */
        const onConfirm = (value) => {
            data.categoryName = value.text;
            publishParam.categoryUuid = value.uuid
            data.categoryShow = false;
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
        onMounted(() => {
            allPlate()
        })
        return {
            publishParam,
            data,
            uploadShow,
            afterRead,
            onOversize,
            submitPublish,
            showCategory,
            onConfirm,
            deleteImage,
            checkSelectIsSyncLibertySquare,
            changeIsSyncLibertySquare
        }
    }
}
</script>

<style scoped>

</style>