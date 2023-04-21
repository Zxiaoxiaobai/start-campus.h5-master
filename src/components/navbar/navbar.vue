<template>
    <div>
        <van-nav-bar :title="data.title" left-text="返回" left-arrow @click-left="onClickLeft()"/>
    </div>
</template>
<script>
import {reactive} from "vue";
import {useRouter} from "vue-router";

export default {
    name: "navbar",
    props: {
        title: String,
        path: String
    },
    setup(props) {
        const router = useRouter();
        const data = reactive({
            title: props.title
        })
        const onClickLeft = () => {
            if (props.path === 'previous') {
                // 回到上一步
                history.back()
            } else {
                router.push(props.path)
            }
        }
        return {
            data,
            onClickLeft
        }
    }
}
</script>