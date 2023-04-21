<template>
    <div>
        <van-cell>
            <template #icon>
                <van-image width="5rem" height="5rem" :src="data.setMessageImage"/>
            </template>
            <template #value>
                <van-cell-group inset>
                    <van-notice-bar
                        wrapable
                        :scrollable="false"
                    >
                        <template #default>
                            <span style="display: flex">基本信息设置要求：</span>
                            <span style="display: flex">1，头像不能超过10M</span>
                            <span style="display: flex">2，昵称不能出现敏感词汇</span>
                            <span style="display: flex">3，学校选择设置后不能修改</span>
                            <span style="display: flex">4，个性标签不能超过50字</span>
                        </template>
                    </van-notice-bar>
                </van-cell-group>
            </template>
        </van-cell>
        <van-form @submit="setUserBasicMessage">
            <van-cell-group inset>
                <van-field name="uploader" label="头像" required>
                    <template #input>
                        <van-uploader :after-read="afterRead" :max-size="10240 * 1024" @oversize="onOversize">
                            <van-image width="5rem" height="5rem" :src="setBasicMessageRo.avatar">
                                <template v-slot:loading>
                                    头像
                                </template>
                            </van-image>
                        </van-uploader>
                    </template>
                </van-field>
                <van-field
                    v-model="setBasicMessageRo.nickName"
                    name="昵称"
                    label="昵称"
                    required
                    placeholder="请输入唯一昵称"
                    :disabled="setBasicMessageRo.sourceType === 1"
                    :rules="[{ required: true, message: '请填写昵称' }]"
                />
                <van-field
                    v-model="data.sexName"
                    is-link
                    readonly
                    required
                    name="picker"
                    label="性别"
                    placeholder="选择性别"
                    @click="data.sexShowPicker = true"
                    :rules="[{ required: true, message: '请选择性别' }]"
                />
                <van-popup v-model:show="data.sexShowPicker" position="bottom">
                    <van-picker
                        :columns="sexColumns"
                        @confirm="onConfirmSelectSex"
                        @cancel="data.sexShowPicker = false"
                    />
                </van-popup>
                <van-field
                    v-model="setBasicMessageRo.birthday"
                    is-link
                    readonly
                    required
                    name="calendar"
                    label="生日"
                    placeholder="点击选择日期"
                    @click="data.showCalendar = true"
                    :rules="[{required:true,message:'请选择生日'}]"
                />
<!--              <van-calendar v-model:show="data.showCalendar" @confirm="onConfirmSelectBirthday" position="right"-->
<!--                              :min-date="new Date(1974,1,1)" :max-date="new Date()"/>-->
<!--              <van-date-picker  @confirm="onConfirmSelectBirthday" position="bottom"-->
<!--                            :min-date="new Date(1974,1,1)" :max-date="new Date()"/>-->
              <van-datetime-picker
                  v-model="currentDate"
                  v-show="data.showCalendar"
                  @confirm="onConfirmSelectBirthday"
                  @cancel="data.showCalendar=false"
                  type="date"
                  title="选择年月日"
                  :min-date="new Date(1974,1,1)"
                  :max-date="new Date()"
              />
                <van-field v-model="data.schoolName" is-link required readonly label="学校" placeholder="选择学校"
                           @click="data.schoolShow = true" :rules="[{required:true,message:'请选择学校'}]"/>
                <van-popup v-model:show="data.schoolShow" round position="bottom">
                    <van-picker :columns="data.schools" @cancel="showPicker = false" @confirm="onConfirmSelectSchool"/>
                </van-popup>
                <van-field v-model="setBasicMessageRo.signature" required rows="2" autosize label="个性签名"
                           type="textarea"
                           maxlength="50"
                           placeholder="请输入个性签名" show-word-limit
                           :rules="[{ required: true, message: '请输入个性签名' }]"/>
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {all} from "@/api/school/school";
import {setBasicMessage, currentUserInfo} from "@/api/user/user"
import {getUserInfo, setUserInfo} from "@/utils/auth";
import {Notify} from "vant";
import {uploadImage} from "@/api/upload/upload";
import {useRouter} from "vue-router";
//import { ref } from 'vue'

export default ({
    setup() {
        const setBasicMessageRo = reactive({
            nickName: '',
            sex: '',
            birthday: '',
            signature: '',
            schoolUuid: '',
            avatar: '',
            sourceType: ''
        })
        const data = reactive({
            sexShowPicker: false,
            sexName: '',
            showCalendar: false,
            schoolShow: false,
            schools: [],
            schoolName: '',
            setMessageImage: require('../../assets/static/image/设置基础信息.png'),
            userInfo: getUserInfo()
        })
        const sexColumns = [
            {
                sex: 1,
                text: '男',
            },
            {
                sex: 2,
                text: '女'
            },
            {
                sex: 3,
                text: '未知'
            }
        ]
        const formatDate = (date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        const router = useRouter();
        /**
         * 确认选择性别
         * @param value
         */
        const onConfirmSelectSex = (value) => {
            data.sexName = value.text;
            setBasicMessageRo.sex = value.sex
            data.sexShowPicker = false;
        };
        /**
         * 确认选择日期
         * @param value
         */

        // const onConfirmSelectBirthday = (value) => {
        //     setBasicMessageRo.birthday = formatDate(value)
        //     data.showCalendar = false
        // }
      const onConfirmSelectBirthday =(currentDate)=>{
        setBasicMessageRo.birthday =  formatDate(currentDate),
        data.showCalendar = false

      }
        /**
         * 获取全部学校
         * @returns {Promise<void>}
         */
        const allSchool = async () => {
            all().then(res => {
                const schoolDatas = []
                res.data.forEach(school => {
                    schoolDatas.push({
                        uuid: school.uuid,
                        text: school.name
                    })
                });
                data.schools = schoolDatas
            })
        }
        /**
         * 确认选择学校
         * @param value
         */
        const onConfirmSelectSchool = (value) => {
            data.schoolName = value.text;
            setBasicMessageRo.schoolUuid = value.uuid
            data.schoolShow = false;
        }
        /**
         * 设置基本信息
         */
        const setUserBasicMessage = () => {
            setBasicMessage(setBasicMessageRo).then(() => {
                // 获取用户信息
                currentUserInfo().then(res => {
                    setUserInfo(res.data)
                })
                Notify({type: 'success', message: '信息设置成功'});
                setTimeout(function () {
                    router.push('/')
                }, 2000)
            })
        }
        /**
         * 上传图片
         * @param file
         */
        const afterRead = (file) => {
            // 声明form表单数据
            const formData = new FormData();
            formData.append("image", file.file);
            uploadImage(formData).then(res => {
                setBasicMessageRo.avatar = res.data
                Notify({type: 'success', message: '上传成功'});
            })
        }
        /**
         * 限制头像大小最大为10M
         */
        const onOversize = () => {
            Notify({type: 'danger', message: '头像大小不能超过10M'});
        }
        onMounted(() => {
            allSchool()
            currentUserInfo().then(res => {
                setBasicMessageRo.avatar = res.data.avatar;
                setBasicMessageRo.nickName = res.data.nickName
                setBasicMessageRo.sourceType = res.data.sourceType
            })
        })
        // const currentDate = ref(['2021', '01', '01']);
        return {
            setBasicMessageRo,
            data,
            sexColumns,
            onConfirmSelectSex,
            onConfirmSelectBirthday,
            onConfirmSelectSchool,
            setUserBasicMessage,
            afterRead,
            onOversize,
          // minDate: new Date(2020, 0, 1),
          // maxDate: new Date(2025, 5, 1),
          // currentDate:['2021', '01', '01']
        }
    }
})
</script>