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
                            <span style="display: flex">悄悄话修改须知：</span>
                            <span style="display: flex">1，发布文字不能出现敏感词汇</span>
                            <span style="display: flex">2，不能出现敏感图片</span>
                            <span style="display: flex">3，最多只能上传6张图片</span>
                            <span style="display: flex">4，图片不能超过5M</span>
                            <span style="display: flex">5，修改次数不能超过5次</span>
                        </template>
                    </van-notice-bar>
                </van-cell-group>
            </template>
        </van-cell>
        <van-form @submit="submitPublish">
            <van-cell-group inset>
                <van-field
                    required
                    readonly
                    label="圈子"
                    placeholder="选择合适的圈子会有很多收获哦"
                    is-link
                    @click="showCircle"
                    v-model="data.circleTitle"
                    :rules="[{ required: true, message: '请选择圈子' }]"/>
                <van-popup v-model:show="data.circleShow" round position="right" style="height: 100%;width: 50%">
                    <van-list
                        v-model:loading="data.circleLoading"
                        :finished="data.circleFinished"
                        finished-text="没有更多了"
                        @load="onLoad"
                    >
                        <van-cell v-for="circle in data.circles" :key="circle.uuid" @click="selectedCircle(circle)">
                            <template #icon>
                                <van-space :size="5">
                                    <van-image
                                        round
                                        width="30px"
                                        height="30px"
                                        :src="circle.avatar"
                                    />
                                    <span>{{ circle.title }}</span>
                                </van-space>
                            </template>
                        </van-cell>
                    </van-list>
                </van-popup>
                <van-field
                    required
                    v-model="publishParam.content"
                    type="textarea"
                    name="description"
                    label="内容"
                    placeholder="悄悄的说两句"
                    :rules="[{ required: true, message: '请输入内容' }]"
                />
                <van-field
                    required
                    v-model="publishParam.labels"
                    name="description"
                    label="标签"
                    :rules="[{ required: true, message: '请选择标签' }]"
                >
                    <template #input>
                        <van-checkbox-group v-model="data.labelChecked" direction="horizontal" @change="selectLabel">
                            <van-checkbox :name="label.uuid" shape="square" v-for="label in data.labels"
                                          :key="label.uuid"
                                          style="margin: 5px">{{ label.name }}
                            </van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>
                <van-field name="switch" label-width="100px" label="是否隐藏" required
                           :rules="[{ validator: checkSelectIsHide }]">
                    <template #input>
                        <van-switch v-model="publishParam.isHide" size="20" @change="changeIsHide"/>
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
                                同步到自由广场后，各个学校的都可以浏览你发布的动态
                                <template #reference>
                                    <van-icon name="question" size="20"/>
                                </template>
                            </van-popover>
                        </van-space>
                    </template>
                </van-field>
                <van-field name="uploader" label="图片">
                    <template #input>
                        <van-uploader :after-read="afterRead" :max-size="5120 * 1024" v-model="data.imageList"
                                      :max-count="6"
                                      @oversize="onOversize" @delete="deleteImage"/>
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
import UploadImageLoading from "@/components/upload/uploadImageLoading";
import {useRoute} from "vue-router";
import {detail, updateWhisper} from "@/api/dynamic/dynamic";
import {list} from "@/api/circle/circleLable";
import {Notify} from "vant";
import {useRouter} from "vue-router";
import {uploadImage} from "@/api/upload/upload";
import {page} from "@/api/circle/circle";
import Navbar from "@/components/navbar/navbar";

export default {
    components: {UploadImageLoading, Navbar},
    setup() {
        const route = useRoute();
        const router = useRouter();
        const data = reactive({
            navbarTitle: '修改悄悄话',
            navbarPath: '/treeHole/index',
            dynamicUuid: route.query.uuid,
            circleTitle: '',
            labels: [],
            imageList: [],
            labelChecked: [],
            circleShow: false,
            circles: [],
            showSyncLibertySquareQuestion: false
        })
        const uploadShow = ref(false);
        const publishParam = reactive({
            content: '',
            circleUuid: '',
            plateUuid: '',
            imageUrls: [],
            labels: [],
            isHide: false,
            isOpenComment: true,
            isSyncLibertySquare: false
        })
        const circleSearchParam = reactive({
            page: 0,
            size: 10
        })
        /**
         * 动态详情
         */
        const dynamicDetail = () => {
            detail(data.dynamicUuid).then(res => {
                const result = res.data
                publishParam.circleUuid = result.circleUuid
                publishParam.content = result.content
                publishParam.plateUuid = result.plateUuid
                publishParam.isOpenComment = result.isOpenComment
                publishParam.imageUrls = result.images
                publishParam.isSyncLibertySquare = result.isSyncLibertySquare
                data.circleTitle = result.publishCircleTitle
                // 获取圈子标签
                list(result.circleUuid).then(res => {
                    data.labels = res.data
                    // 这里实现默认选中复选框
                    result.labels.forEach(label => {
                        const checkLabel = data.labels.filter(item => {
                            return item.name === label
                        })
                        data.labelChecked.push(checkLabel[0].uuid)
                    })
                    publishParam.labels = publishParam.labels.concat(data.labelChecked)
                })
                // 渲染图片
                result.images.forEach(image => {
                    data.imageList.push({url: image})
                })
            })
        }
        /**
         * 选中标签
         * @param selection
         */
        const selectLabel = () => {
            publishParam.labels = []
            publishParam.labels = publishParam.labels.concat(data.labelChecked)
        }
        /**
         * 提交审核
         */
        const submitPublish = () => {
            publishParam.labels = publishParam.labels.split(",")
            updateWhisper(publishParam, data.dynamicUuid).then(() => {
                Notify({type: 'success', message: '发布成功，等待管理员审核', duration: 1000});
                setTimeout(function () {
                    router.push("/user/dynamic")
                }, 1000)
            })
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
                publishParam.imageUrls.push(res.data)
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
            Notify({type: 'danger', message: '图片不能超过5M'});
        };
        /**
         * 删除图片
         */
        const deleteImage = (file, detail) => {
            publishParam.imageUrls.splice(detail.index, 1)
        }
        const onClickLeft = async () => {
            history.back();
        }
        /**
         * 分页查询圈子
         */
        const pageSearchCircle = () => {
            page(circleSearchParam).then(res => {
                if (res.data.records.length < circleSearchParam.size) {
                    data.circleFinished = true
                }
                data.circles = data.circles.concat(res.data.records)
            })
        }
        const onLoad = () => {
            circleSearchParam.page++
            pageSearchCircle()
        }
        /**
         * 选中圈子
         * @param circle
         */
        const selectedCircle = (circle) => {
            publishParam.labels = []
            data.labelChecked = []
            data.circleTitle = circle.title
            publishParam.circleUuid = circle.uuid
            data.circleShow = false
            list(circle.uuid).then(res => {
                data.labels = res.data
            })
        }
        /**
         * 显示圈子
         * @returns {Promise<void>}
         */
        const showCircle = async () => {
            data.circleShow = true;
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
        const checkSelectIsHide = () => {
            if (publishParam.isHide === '' || publishParam.isHide === undefined) {
                return "请选择是否隐藏"
            }
        }
        onMounted(() => {
            dynamicDetail()
        })
        return {
            data,
            uploadShow,
            publishParam,
            submitPublish,
            selectLabel,
            afterRead,
            onOversize,
            deleteImage,
            onClickLeft,
            onLoad,
            selectedCircle,
            showCircle,
            checkSelectIsSyncLibertySquare,
            changeIsSyncLibertySquare,
            checkSelectIsHide
        }
    }
}
</script>