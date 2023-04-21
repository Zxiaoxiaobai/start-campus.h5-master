<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell-group>
            <van-field label="反馈类型" placeholder="选择类型" is-link v-model="data.feedbackRecordTypeName"
                       @click="selectFeedbackRecordType"></van-field>
            <van-popup :show="data.show" custom-class="bottom" position="bottom">
                <van-picker show-toolbar title="反馈记录类型" :columns="data.feedbackTypes" @cancel="data.show = false"
                            @confirm="onConfirm"/>
            </van-popup>
            <van-field show-word-limit="true" maxlength="100" autosize="{ maxHeight: 500px, minHeight: 200px }"
                       label="反馈内容"
                       type="textarea" v-model="feedbackParam.content" placeholder="请输入反馈内容"
                       border="{{ true }}"/>
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="submitFeedback">
                提交
            </van-button>
        </div>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {all} from "@/api/feedbackRecord/feedbackRecordType";
import {add} from "@/api/feedbackRecord/feedbackRecord";
import {Notify} from "vant";
import {useRouter} from 'vue-router'
import Navbar from "@/components/navbar/navbar";

export default {
    name: "feedback",
    components: {Navbar},
    setup() {
        const data = reactive({
            navbarTitle: '我要反馈',
            navbarPath: '/user/person',
            feedbackRecordTypeName: '',
            show: false,
            feedbackTypes: []
        })
        const feedbackParam = reactive({
            feedbackRecordTypeUuid: '',
            content: ''
        })
        const router = useRouter();
        /**
         * 选择反馈记录类型
         * @returns {Promise<void>}
         */
        const selectFeedbackRecordType = async () => {
            data.show = true;
        }
        /**
         * 获取全部反馈记录类型
         * @returns {Promise<void>}
         */
        const allFeedbackRecordType = async () => {
            all().then(res => {
                const feedRecordTypeDatas = []
                res.data.forEach(feedbackRecordType => {
                    feedRecordTypeDatas.push({
                        uuid: feedbackRecordType.uuid,
                        text: feedbackRecordType.name
                    })
                })
                data.feedbackTypes = feedRecordTypeDatas;
            })
        }
        /**
         * 确认选择类型
         * @param value
         */
        const onConfirm = (value) => {
            data.feedbackRecordTypeName = value.text;
            feedbackParam.feedbackRecordTypeUuid = value.uuid
            data.show = false;
        }
        /**
         * 提交反馈
         * @returns {Promise<void>}
         */
        const submitFeedback = async () => {
            add(feedbackParam).then(() => {
                Notify({type: 'success', message: '反馈成功'});
            })
            setTimeout(function () {
                router.push("/user/person")
            }, 2000)
        }
        onMounted(() => {
            allFeedbackRecordType()
        })
        return {
            data,
            feedbackParam,
            selectFeedbackRecordType,
            onConfirm,
            submitFeedback,
        }
    }
}
</script>

<style scoped>

</style>