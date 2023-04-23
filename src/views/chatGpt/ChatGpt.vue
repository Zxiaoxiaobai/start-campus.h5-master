<!--<template>-->
<!--  <div class="chat-window">-->
<!--    <div class="top">-->
<!--      <div class="head-pic">-->
<!--        <HeadPortrait :imgUrl="frinedInfo.headImg"></HeadPortrait>-->
<!--      </div>-->
<!--      <div class="info-detail">-->
<!--        <div class="name">{{ frinedInfo.name }}</div>-->
<!--        <div class="detail">{{ frinedInfo.detail }}</div>-->
<!--      </div>-->
<!--      <div class="other-fun">-->
<!--        <span class="iconfont icon-shipin" @click="video"> </span>-->
<!--        <span class="iconfont icon-gf-telephone" @click="telephone"></span>-->
<!--        <label for="docFile">-->
<!--          <span class="iconfont icon-wenjian"></span>-->
<!--        </label>-->
<!--        <label for="imgFile">-->
<!--          <span class="iconfont icon-tupian"></span>-->
<!--        </label>-->
<!--        <input-->
<!--            type="file"-->
<!--            name=""-->
<!--            id="imgFile"-->
<!--            @change="sendImg"-->
<!--            accept="image/*"-->
<!--        />-->
<!--        <input-->
<!--            type="file"-->
<!--            name=""-->
<!--            id="docFile"-->
<!--            @change="sendFile"-->
<!--            accept="application/*,text/*"-->
<!--        />-->
<!--        &lt;!&ndash; accept="application/*" &ndash;&gt;-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="botoom">-->
<!--      <div class="chat-content" ref="chatContent">-->
<!--        <div-->
<!--            class="chat-wrapper"-->
<!--            v-for="(item, index) in chatList"-->
<!--            :key="item.id"-->
<!--        >-->

<!--          &lt;!&ndash; <div v-if="isSend && index == chatList.length - 1">-->
<!--            <div class="chat-friend" v-if="item.uid !== '1001'">-->
<!--              <div class="info-time">-->
<!--                <img :src="item.headImg" alt="" />-->
<!--                <span>{{ item.name }}</span>-->
<!--                <span>{{ item.time }}</span>-->
<!--              </div>-->
<!--              <div class="chat-text" v-if="item.chatType == 0">-->
<!--                <span class="flash_cursor"></span>-->
<!--              </div>-->
<!--            </div> -->
<!--          </div>&ndash;&gt;-->
<!--          <div class="chat-friend" v-if="item.uid !== '1001'">-->
<!--            <div class="info-time">-->
<!--              <img :src="item.headImg" alt="" />-->
<!--              <span>{{ item.name }}</span>-->
<!--              <span>{{ item.time }}</span>-->
<!--            </div>-->
<!--            <div class="chat-text" v-if="item.chatType == 0&&item.type != 1">-->
<!--              <template v-if="isSend && index == chatList.length - 1">-->
<!--                <span class="flash_cursor">请稍后...</span>-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                <pre>{{ item.msg }}</pre>-->
<!--              </template>-->
<!--            </div>-->
<!--            <div class="chat-img" v-if="item.chatType == 1">-->
<!--              <img-->
<!--                  :src="item.msg"-->
<!--                  alt="表情"-->
<!--                  v-if="item.extend.imgType == 1"-->
<!--                  style="width: 100px; height: 100px"-->
<!--              />-->
<!--              <el-image :src="item.msg" :preview-src-list="srcImgList" v-else>-->
<!--              </el-image>-->
<!--            </div>-->
<!--            <div class="chat-img" v-if="item.type == 1">-->
<!--              <img-->
<!--                  v-for="(items,index) in item.images"-->
<!--                  :src="items"-->
<!--                  :key="index"-->
<!--                  alt="表情"-->
<!--                  style="width: 100px; height: 100px"-->
<!--              />-->

<!--            </div>-->
<!--            <div class="chat-img" v-if="item.chatType == 2">-->
<!--              <div class="word-file">-->
<!--                <FileCard-->
<!--                    :fileType="item.extend.fileType"-->
<!--                    :file="item.msg"-->
<!--                ></FileCard>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="chat-me" v-else>-->
<!--            <div class="info-time">-->
<!--              <span>{{ item.name }}</span>-->
<!--              <span>{{ item.time }}</span>-->
<!--              <img :src="item.headImg" alt="" />-->
<!--            </div>-->
<!--            <div class="chat-text" v-if="item.chatType == 0">-->
<!--              {{ item.msg }}-->
<!--            </div>-->
<!--            <div class="chat-img" v-if="item.chatType == 1">-->
<!--              <img-->
<!--                  :src="item.msg"-->
<!--                  alt="表情"-->
<!--                  v-if="item.extend.imgType == 1"-->
<!--                  style="width: 100px; height: 100px"-->
<!--              />-->
<!--              <el-image-->
<!--                  style="max-width: 300px; border-radius: 10px"-->
<!--                  :src="item.msg"-->
<!--                  :preview-src-list="srcImgList"-->
<!--                  v-else-->
<!--              >-->
<!--              </el-image>-->
<!--            </div>-->
<!--            <div class="chat-img" v-if="item.chatType == 2">-->
<!--              <div class="word-file">-->
<!--                <FileCard-->
<!--                    :fileType="item.extend.fileType"-->
<!--                    :file="item.msg"-->
<!--                ></FileCard>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="chatInputs">-->
<!--        &lt;!&ndash; -->
<!--            v-show="showEmoji"-->
<!-- -->
<!--         &ndash;&gt;-->
<!--        &lt;!&ndash; <div class="emoji boxinput" @click="clickEmoji">-->
<!--          <img src="@/assets/img/emoji/smiling-face.png" alt="" />-->
<!--        </div> &ndash;&gt;-->
<!--        <div class="emoji-content">-->
<!--          <Emoji-->
<!--              @sendEmoji="sendEmoji"-->
<!--              v-show="showEmoji"-->
<!--              @closeEmoji="clickEmoji"-->
<!--          ></Emoji>-->
<!--        </div>-->
<!--        <input class="inputs" v-model="inputMsg" @keyup.enter="sendText" />-->
<!--        <el-button class="send boxinput" :disabled="isSend" @click="sendText">-->
<!--          <img src="@/assets/img/emoji/rocket.png" alt="" />-->
<!--        </el-button>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { animation } from "@/util/util";-->
<!--import { getChatMsg, chatgpt } from "@/api/getData";-->

<!--import HeadPortrait from "@/components/HeadPortrait";-->
<!--import Emoji from "@/components/Emoji";-->
<!--import FileCard from "@/components/FileCard.vue";-->
<!--export default {-->
<!--  name: "ChatGpt",-->
<!--  components: {-->
<!--    HeadPortrait,-->
<!--    Emoji,-->
<!--    FileCard,-->
<!--  },-->
<!--  props: {-->
<!--    frinedInfo: Object,-->
<!--    default() {-->
<!--      return {};-->
<!--    },-->
<!--  },-->
<!--  watch: {-->
<!--    frinedInfo() {-->
<!--      this.getFriendChatMsg();-->
<!--    },-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      chatList: [],-->
<!--      inputMsg: "",-->
<!--      showEmoji: false,-->
<!--      friendInfo: {},-->
<!--      srcImgList: [],-->
<!--      isSend: false,-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    this.getFriendChatMsg();-->
<!--  },-->
<!--  methods: {-->
<!--    //获取聊天记录-->
<!--    getFriendChatMsg() {-->
<!--      let params = {-->
<!--        frinedId: this.frinedInfo.id,-->
<!--      };-->
<!--      getChatMsg(params).then((res) => {-->
<!--        console.error("333", res);-->
<!--        this.chatList = res;-->
<!--        // this.chatList.forEach((item) => {-->
<!--        // if (item.chatType == 2 && item.extend.imgType == 2) {-->
<!--        //   this.srcImgList.push(item.msg);-->
<!--        // }-->
<!--        // });-->
<!--        this.scrollBottom();-->
<!--      });-->
<!--    },-->
<!--    //发送信息-->
<!--    sendMsg(msgList) {-->
<!--      this.chatList.push(msgList);-->
<!--      this.scrollBottom();-->
<!--    },-->
<!--    //获取窗口高度并滚动至最底层-->
<!--    scrollBottom() {-->
<!--      this.$nextTick(() => {-->
<!--        const scrollDom = this.$refs.chatContent;-->
<!--        animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight);-->
<!--      });-->
<!--    },-->
<!--    //关闭标签框-->
<!--    clickEmoji() {-->
<!--      this.showEmoji = !this.showEmoji;-->
<!--    },-->
<!--    //发送文字信息-->
<!--    sendText() {-->
<!--      if (this.inputMsg) {-->
<!--        let chatMsg = {-->
<!--          headImg: require("@/assets/img/head_portrait.jpg"),-->
<!--          name: "",-->
<!--          time: new Date().toLocaleTimeString(),-->
<!--          msg: this.inputMsg,-->
<!--          chatType: 0, //信息类型，0文字，1图片-->
<!--          uid: "1001", //uid-->
<!--        };-->
<!--        this.sendMsg(chatMsg);-->
<!--        this.$emit("personCardSort", this.frinedInfo.id);-->
<!--        this.inputMsg = "";-->
<!--        let data = {-->
<!--          //       prompt: chatMsg.msg,-->
<!--          //       temperature: 1,-->
<!--          //       top_p: 1,-->
<!--          //       // model: "text-davinci-003",-->
<!--          //       max_tokens: 2048,-->
<!--          //       frequency_penalty: 0,-->
<!--          //       "model": "gpt-3.5-turbo",-->
<!--          // "messages": [{"role": "user", "content": "Hello!"}],-->
<!--          //       presence_penalty: 0,-->
<!--          //       stop: ["Human:", "AI:"],-->
<!--          model: "gpt-3.5-turbo",-->
<!--          messages: [{ role: "user", content: chatMsg.msg }],-->
<!--        };-->
<!--        this.loading = true;-->
<!--        this.isSend = true;-->
<!--        let chatGPT = {-->
<!--          headImg: require("@/assets/img/head_portrait1.jpg"),-->
<!--          name: "小五",-->
<!--          time: new Date().toLocaleTimeString(),-->
<!--          msg: "",-->
<!--          images: [],-->
<!--          chatType: 0, //信息类型，0文字，1图片-->
<!--          uid: "1002", //uid-->
<!--        };-->
<!--        this.sendMsg(chatGPT);-->
<!--        chatgpt(data).then((res) => {-->
<!--          this.isSend = false;-->

<!--          if (res.data) {-->
<!--            this.chatList[this.chatList.length - 1].images=[];-->
<!--            console.error("555", this.chatList);-->
<!--            this.chatList[this.chatList.length - 1].type = 1;-->
<!--            this.chatList[this.chatList.length - 1].images.push(res.data[0].url);-->
<!--          } else {-->
<!--            this.chatList[this.chatList.length - 1].msg =-->
<!--                res.choices[0].message.content;-->
<!--          }-->
<!--        });-->
<!--      } else {-->
<!--        this.$message({-->
<!--          message: "消息不能为空哦~",-->
<!--          type: "warning",-->
<!--        });-->
<!--      }-->
<!--    },-->
<!--    //发送表情-->
<!--    sendEmoji(msg) {-->
<!--      let chatMsg = {-->
<!--        headImg: require("@/assets/img/head_portrait.jpg"),-->
<!--        name: "大毛是小白",-->
<!--        time: new Date().toLocaleTimeString(),-->
<!--        msg: msg,-->
<!--        chatType: 1, //信息类型，0文字，1图片-->
<!--        extend: {-->
<!--          imgType: 1, //(1表情，2本地图片)-->
<!--        },-->
<!--        uid: "1001",-->
<!--      };-->
<!--      this.sendMsg(chatMsg);-->
<!--      this.clickEmoji();-->
<!--    },-->
<!--    //发送本地图片-->
<!--    sendImg(e) {-->
<!--      let _this = this;-->
<!--      console.log(e.target.files);-->
<!--      let chatMsg = {-->
<!--        headImg: require("@/assets/img/head_portrait.jpg"),-->
<!--        name: "大毛是小白",-->
<!--        time: "09：12 AM",-->
<!--        msg: "",-->
<!--        chatType: 1, //信息类型，0文字，1图片, 2文件-->
<!--        extend: {-->
<!--          imgType: 2, //(1表情，2本地图片)-->
<!--        },-->
<!--        uid: "1001",-->
<!--      };-->
<!--      let files = e.target.files[0]; //图片文件名-->
<!--      if (!e || !window.FileReader) return; // 看是否支持FileReader-->
<!--      let reader = new FileReader();-->
<!--      reader.readAsDataURL(files); // 关键一步，在这里转换的-->
<!--      reader.onloadend = function () {-->
<!--        chatMsg.msg = this.result; //赋值-->
<!--        _this.srcImgList.push(chatMsg.msg);-->
<!--      };-->
<!--      this.sendMsg(chatMsg);-->
<!--      e.target.files = null;-->
<!--    },-->
<!--    //发送文件-->
<!--    sendFile(e) {-->
<!--      let chatMsg = {-->
<!--        headImg: require("@/assets/img/head_portrait.jpg"),-->
<!--        name: "大毛是小白",-->
<!--        time: "09：12 AM",-->
<!--        msg: "",-->
<!--        chatType: 2, //信息类型，0文字，1图片, 2文件-->
<!--        extend: {-->
<!--          fileType: "", //(1word，2excel，3ppt，4pdf，5zpi, 6txt)-->
<!--        },-->
<!--        uid: "1001",-->
<!--      };-->
<!--      let files = e.target.files[0]; //图片文件名-->
<!--      chatMsg.msg = files;-->
<!--      console.log(files);-->
<!--      if (files) {-->
<!--        switch (files.type) {-->
<!--          case "application/msword":-->
<!--          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":-->
<!--            chatMsg.extend.fileType = 1;-->
<!--            break;-->
<!--          case "application/vnd.ms-excel":-->
<!--          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":-->
<!--            chatMsg.extend.fileType = 2;-->
<!--            break;-->
<!--          case "application/vnd.ms-powerpoint":-->
<!--          case "application/vnd.openxmlformats-officedocument.presentationml.presentation":-->
<!--            chatMsg.extend.fileType = 3;-->
<!--            break;-->
<!--          case "application/pdf":-->
<!--            chatMsg.extend.fileType = 4;-->
<!--            break;-->
<!--          case "application/zip":-->
<!--          case "application/x-zip-compressed":-->
<!--            chatMsg.extend.fileType = 5;-->
<!--            break;-->
<!--          case "text/plain":-->
<!--            chatMsg.extend.fileType = 6;-->
<!--            break;-->
<!--          default:-->
<!--            chatMsg.extend.fileType = 0;-->
<!--        }-->
<!--        this.sendMsg(chatMsg);-->
<!--        e.target.files = null;-->
<!--      }-->
<!--    },-->
<!--    // 发送语音-->
<!--    telephone() {-->
<!--      this.$message("敬请期待一下吧~🥳");-->
<!--    },-->
<!--    //发送视频-->
<!--    video() {-->
<!--      this.$message("敬请期待一下吧~🥳");-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.flash_cursor {-->
<!--  width: auto;-->
<!--  height: 30px;-->
<!--  display: inline-block;-->
<!--  background: #d6e3f5;-->
<!--  opacity: 1;-->
<!--  animation: glow 800ms ease-out infinite alternate;-->
<!--}-->

<!--@keyframes glow {-->
<!--  0% {-->
<!--    opacity: 1;-->
<!--  }-->

<!--  25% {-->
<!--    opacity: 0.5;-->
<!--  }-->

<!--  50% {-->
<!--    opacity: 0;-->
<!--  }-->

<!--  75% {-->
<!--    opacity: 0.5;-->
<!--  }-->

<!--  100% {-->
<!--    opacity: 1;-->
<!--  }-->
<!--}-->

<!--.chat-window {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  margin: 0 auto;-->
<!--  position: relative;-->

<!--  .top {-->
<!--    margin-bottom: 20px;-->
<!--    &::after {-->
<!--      content: "";-->
<!--      display: block;-->
<!--      clear: both;-->
<!--    }-->

<!--    .head-pic {-->
<!--      float: left;-->
<!--    }-->

<!--    .info-detail {-->
<!--      float: left;-->
<!--      margin: 5px 20px 0;-->

<!--      .name {-->
<!--        font-size: 20px;-->
<!--        font-weight: 600;-->
<!--        color: #fff;-->
<!--      }-->

<!--      .detail {-->
<!--        color: #9e9e9e;-->
<!--        font-size: 12px;-->
<!--        margin-top: 2px;-->
<!--      }-->
<!--    }-->

<!--    .other-fun {-->
<!--      float: right;-->
<!--      margin-top: 20px;-->

<!--      span {-->
<!--        margin-left: 30px;-->
<!--        cursor: pointer;-->
<!--      }-->

<!--      // .icon-tupian {-->

<!--      // }-->
<!--      input {-->
<!--        display: none;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .botoom {-->
<!--    width: 100%;-->
<!--    height: 70vh;-->
<!--    background-color: rgb(50, 54, 68);-->
<!--    border-radius: 20px;-->
<!--    padding: 20px;-->
<!--    box-sizing: border-box;-->
<!--    position: relative;-->

<!--    .chat-content {-->
<!--      width: 100%;-->
<!--      height: 85%;-->
<!--      overflow-y: scroll;-->
<!--      padding: 20px;-->
<!--      box-sizing: border-box;-->

<!--      &::-webkit-scrollbar {-->
<!--        width: 0;-->
<!--        /* Safari,Chrome 隐藏滚动条 */-->
<!--        height: 0;-->
<!--        /* Safari,Chrome 隐藏滚动条 */-->
<!--        display: none;-->
<!--        /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */-->
<!--      }-->

<!--      .chat-wrapper {-->
<!--        position: relative;-->
<!--        word-break: break-all;-->

<!--        .chat-friend {-->
<!--          width: 100%;-->
<!--          float: left;-->
<!--          margin-bottom: 20px;-->
<!--          display: flex;-->
<!--          flex-direction: column;-->
<!--          justify-content: flex-start;-->
<!--          align-items: flex-start;-->

<!--          .chat-text {-->
<!--            max-width: 90%;-->
<!--            padding: 20px;-->
<!--            border-radius: 20px 20px 20px 5px;-->
<!--            background-color: rgb(56, 60, 75);-->
<!--            color: #fff;-->

<!--            &:hover {-->
<!--              background-color: rgb(39, 42, 55);-->
<!--            }-->

<!--            pre {-->
<!--              white-space: break-spaces;-->
<!--            }-->
<!--          }-->

<!--          .chat-img {-->
<!--            img {-->
<!--              width: 100px;-->
<!--              height: 100px;-->
<!--            }-->
<!--          }-->

<!--          .info-time {-->
<!--            margin: 10px 0;-->
<!--            color: #fff;-->
<!--            font-size: 14px;-->

<!--            img {-->
<!--              width: 30px;-->
<!--              height: 30px;-->
<!--              border-radius: 50%;-->
<!--              vertical-align: middle;-->
<!--              margin-right: 10px;-->
<!--            }-->

<!--            span:last-child {-->
<!--              color: rgb(101, 104, 115);-->
<!--              margin-left: 10px;-->
<!--              vertical-align: middle;-->
<!--            }-->
<!--          }-->
<!--        }-->

<!--        .chat-me {-->
<!--          width: 100%;-->
<!--          float: right;-->
<!--          margin-bottom: 20px;-->
<!--          position: relative;-->
<!--          display: flex;-->
<!--          flex-direction: column;-->
<!--          justify-content: flex-end;-->
<!--          align-items: flex-end;-->

<!--          .chat-text {-->
<!--            float: right;-->
<!--            max-width: 90%;-->
<!--            padding: 20px;-->
<!--            border-radius: 20px 20px 5px 20px;-->
<!--            background-color: rgb(29, 144, 245);-->
<!--            color: #fff;-->

<!--            &:hover {-->
<!--              background-color: rgb(26, 129, 219);-->
<!--            }-->
<!--          }-->

<!--          .chat-img {-->
<!--            img {-->
<!--              max-width: 300px;-->
<!--              max-height: 200px;-->
<!--              border-radius: 10px;-->
<!--            }-->
<!--          }-->

<!--          .info-time {-->
<!--            margin: 10px 0;-->
<!--            color: #fff;-->
<!--            font-size: 14px;-->
<!--            display: flex;-->
<!--            justify-content: flex-end;-->

<!--            img {-->
<!--              width: 30px;-->
<!--              height: 30px;-->
<!--              border-radius: 50%;-->
<!--              vertical-align: middle;-->
<!--              margin-left: 10px;-->
<!--            }-->

<!--            span {-->
<!--              line-height: 30px;-->
<!--            }-->

<!--            span:first-child {-->
<!--              color: rgb(101, 104, 115);-->
<!--              margin-right: 10px;-->
<!--              vertical-align: middle;-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    .chatInputs {-->
<!--      width: 100%;-->
<!--      position: absolute;-->
<!--      bottom: 0;-->
<!--      margin: 0 auto;-->
<!--      align-items: center;-->
<!--      display: flex;-->
<!--      padding-bottom: 15px;-->
<!--      .boxinput {-->
<!--        width: 50px;-->
<!--        height: 50px;-->
<!--        background-color: rgb(66, 70, 86);-->
<!--        border-radius: 15px;-->
<!--        border: 1px solid rgb(80, 85, 103);-->
<!--        position: relative;-->
<!--        cursor: pointer;-->

<!--        img {-->
<!--          width: 30px;-->
<!--          height: 30px;-->
<!--          position: absolute;-->
<!--          left: 50%;-->
<!--          top: 50%;-->
<!--          transform: translate(-50%, -50%);-->
<!--        }-->
<!--      }-->

<!--      .emoji {-->
<!--        transition: 0.3s;-->

<!--        &:hover {-->
<!--          background-color: rgb(46, 49, 61);-->
<!--          border: 1px solid rgb(71, 73, 82);-->
<!--        }-->
<!--      }-->

<!--      .inputs {-->
<!--        width: 70%;-->
<!--        height: 50px;-->
<!--        background-color: rgb(66, 70, 86);-->
<!--        border-radius: 15px;-->
<!--        border: 2px solid rgb(34, 135, 225);-->
<!--        padding: 10px;-->
<!--        box-sizing: border-box;-->
<!--        transition: 0.2s;-->
<!--        margin-right: 10px;-->
<!--        font-size: 20px;-->
<!--        color: #fff;-->
<!--        font-weight: 100;-->

<!--        &:focus {-->
<!--          outline: none;-->
<!--        }-->
<!--      }-->

<!--      .send {-->
<!--        background-color: rgb(29, 144, 245);-->
<!--        border: 0;-->
<!--        transition: 0.3s;-->
<!--        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);-->

<!--        &:hover {-->
<!--          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->