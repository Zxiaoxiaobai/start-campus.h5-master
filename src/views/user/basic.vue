<template>
    <div>
        <navbar :title="data.navbarTitle" :path="data.navbarPath"/>
        <van-cell-group>
            <van-notice-bar
                wrapable
                :scrollable="false"
            >
                <template #default>
                    <span style="display: flex">基本信息设置注意事项：</span>
                    <span style="display: flex">1，头像不能超过10M</span>
                    <span style="display: flex">2，昵称不能修改，需修改联系管理员</span>
                    <span style="display: flex">3，学校不能修改，需修改联系管理员</span>
                    <span style="display: flex">4，个性标签不能超过50字</span>
                </template>
            </van-notice-bar>
            <van-cell title="头像" :value="data.userInfo.nickName" is-link>
                <template #value>
                    <van-uploader :after-read="uploadAvatar" :max-size="10240 * 1024" @oversize="onOversize">
                        <van-image round width="3rem" height="3rem" :src="data.avatar"/>
                    </van-uploader>
                </template>
            </van-cell>
            <van-cell title="昵称" :value="data.userInfo.nickName"/>
            <van-cell title="所属学校" :value="data.userInfo.schoolName"/>
            <van-cell
                is-link
                readonly
                name="picker"
                title="性别"
                placeholder="选择性别"
                @click="data.sexShowPicker = true"
                :rules="[{ required: true, message: '请选择性别' }]"
            >
                <template #value>
                    {{ data.sexName }}
                </template>
            </van-cell>
            <van-cell
                is-link
                readonly
                name="calendar"
                title="生日"
                placeholder="点击选择日期"
                @click="data.showCalendar = true"
                :rules="[{required:true,message:'请选择生日'}]"
            >
                <template #value>
                    {{ data.birthday }}
                </template>
            </van-cell>
            <van-calendar v-model:show="data.showCalendar" @confirm="onConfirmSelectBirthday" position="right"
                          :min-date="new Date(1974,1,1)" :max-date="new Date()" :default-date="data.defaultDate"/>
            <van-popup v-model:show="data.sexShowPicker" position="bottom">
                <van-picker
                    :columns="sexColumns"
                    @confirm="onConfirmSelectSex"
                    @cancel="data.sexShowPicker = false"
                />
            </van-popup>
            <van-field v-model="data.signature" rows="2" autosize label="个性签名" type="textarea" maxlength="50"
                       placeholder="请输入个性签名" show-word-limit/>
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="updateBasicMessage">
                立即修改
            </van-button>
        </div>
        <upload-image-loading :show-loading="uploadShow"/>
    </div>
</template>

<script>
import {reactive, ref} from 'vue'
import {getUserInfo, setUserInfo} from '@/utils/auth'
import {updateAvatar, updateUserInfo} from "@/api/user/user"
import {Notify} from 'vant'
import {uploadImage} from "@/api/upload/upload";
import Navbar from "@/components/navbar/navbar";
import UploadImageLoading from "@/components/upload/uploadImageLoading";
export default {
    components:{Navbar,UploadImageLoading},
    setup() {
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
        const uploadShow = ref(false);
        const data = reactive({
            navbarTitle: '基本信息',
            navbarPath: '/user/set',
            userInfo: getUserInfo(),
            signature: getUserInfo().signature,
            sexShowPicker: false,
            showCalendar: false,
            birthday: getUserInfo().birthday,
            avatar: getUserInfo().avatar,
            defaultDate: new Date(Date.parse(getUserInfo().birthday)),
            sexName: sexColumns.find(sexColumn => {
                return sexColumn.sex === getUserInfo().sex
            }).text,
        })
        const updateBasicMessage = () => {
            const updateUserInfoRo = {
                signature: data.signature,
                sex: sexColumns.find(sexColumn => {
                    return sexColumn.text === data.sexName
                }).sex,
                birthday: data.birthday
            }
            updateUserInfo(updateUserInfoRo).then(() => {
                data.userInfo.signature = data.signature
                data.userInfo.sex = updateUserInfoRo.sex
                data.userInfo.birthday = updateUserInfoRo.birthday
                setUserInfo(data.userInfo)
                Notify({type: 'success', message: '修改成功'});
            })
        }
        const onClickLeft = async () => {
            history.back();
        }
        const formatDate = (date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        /**
         * 确认选择性别
         * @param value
         */
        const onConfirmSelectSex = (value) => {
            data.sexName = value.text;
            data.sexShowPicker = false;
        };
        /**
         * 确认选择日期
         * @param value
         */
        const onConfirmSelectBirthday = (value) => {
            data.birthday = formatDate(value)
            data.showCalendar = false
        }
        /**
         * 上传头像
         * @param {} file
         */
        const uploadAvatar = (file) => {
            uploadShow.value = true
            // 声明form表单数据
            const formData = new FormData();
            formData.append("image", file.file);
            uploadImage(formData).then(res => {
                data.userInfo.avatar = res.data
                data.avatar = res.data
                setUserInfo(data.userInfo)
                // 执行修改头像
                const userUpdateAvatarRo = {
                    avatar: res.data
                }
                updateAvatar(userUpdateAvatarRo).then(() => {
                    Notify({type: 'success', message: '头像修改成功', duration: 1000});
                })
            }).finally(() => {
                uploadShow.value = false
            })
        }
        /**
         * 限制头像大小最大为10M
         */
        const onOversize = () => {
            Notify({type: 'danger', message: '头像大小不能超过10M'});
        }

        return {
            data,
            sexColumns,
            uploadShow,
            updateBasicMessage,
            onClickLeft,
            onConfirmSelectSex,
            onConfirmSelectBirthday,
            uploadAvatar,
            onOversize
        }
    }
}
</script>

<style>

</style>
