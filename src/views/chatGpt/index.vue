<template>
  <div>
    <!-- 对话窗口 -->
    <div class="conversation">
      <div class="message" v-for="(msg, index) in messages" :key="index" :class="{ 'ai-message': msg.sender === 'ai', 'user-message': msg.sender === 'user' }">
        {{ msg.text }}
      </div>
    </div>

    <!-- 输入框 -->
    <div class="input-box">
      <input type="text" placeholder="请输入你的话语" v-model="userMessage" @keyup.enter="sendMessage" />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "chatGptIndex",
  data() {
    return {
      messages: [],
      userMessage: '',
      openaiApiKey: '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',
      conversationLength: 100,
      model: 'davinci',
      openaiEndpoint: 'https://api.openai.com/v1/'
    };
  },

  methods: {
    async sendMessage() {
      // 获取用户输入的话语
      const userMessage = this.userMessage.trim();

      // 检查用户输入是否为空
      if (userMessage.length === 0) {
        return;
      }

      // 立即更新对话窗口，显示用户输入的话语
      this.messages.push({ text: userMessage, sender: 'user' });
      this.userMessage = '';

      // 发送请求到 OpenAI API
      try {
        const response = await axios.post(`${this.openaiEndpoint}engines/${this.model}/completions`, {
          prompt: this.getConversationPrompts(),
          max_tokens: this.conversationLength,
          temperature: 0.7,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openaiApiKey}`,
          },
        });

        // 将 GPT-3 生成的回复添加到对话窗口中
        const aiMessage = response.data.choices[0].text.trim();
        if (aiMessage.length > 0) {
          this.messages.push({ text: aiMessage, sender: 'ai' });
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 获取对话历史记录
    getConversationPrompts() {
      const maxLength = 100;
      const startIndex = Math.max(0, this.messages.length - maxLength);
      const prompts = this.messages.slice(startIndex).map((msg) => msg.text);
      return prompts.join('\n');
    },
  },
};
</script>

<style>
.conversation {
  height: 400px;
  overflow-y: scroll;
  margin-bottom: 20px;
}

.message {
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 1.6;
  max-width: 80%;
}

.ai-message {
  background-color: #007aff;
  color: #ffffff;
  float: right;
  clear: both;
}

.user-message {
  background-color: #e5e5ea;
  color: #000000;
  float: left;
  clear: both;
}

.input-box {
  display: flex;
}

.input-box input[type='text'] {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  font-size: 18px;
  line-height: 1.6;
  border-radius: 10px;
  border: 1px solid #cccccc;
}

.input-box button {
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}
</style>
