require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const line = require('@line/bot-sdk');

const { createController, matchers } = require('onion-strategy');
const { regex, startsWith, any } = matchers;
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const bot = createController({
  onError: (err, ctx) => {
    console.error('[bot error]', err);
    ctx.reply = '系統錯誤,請稍後再試';
  },
});

// 預處理
bot.use(async (ctx, next) => {
  ctx.text = ctx.text.trim();
  await next();
});

// Logging
bot.use(async (ctx, next) => {
  const t0 = Date.now();
  console.log('[in]', ctx.userId, ctx.text);
  await next();
  console.log('[out]', `${Date.now() - t0}ms`, '→', ctx.reply);
});

// Strategies
bot.when(regex(/^HI\s+(\S+)/), async (ctx) => {
  ctx.reply = `你好`;
});


bot.when(any(startsWith('help'), startsWith('幫助')), async (ctx) => {
  ctx.reply = '可用指令:HI';
});

// Fallback
bot.use(async (ctx) => {
  if (!ctx.matched) ctx.reply = '聽不懂這個指令,輸入「幫助」看看';
});

app.post('/line', async (req, res) => {
  const events = (req.body && req.body.events) || [];

  await Promise.all(
    events
      .filter((e) => e.type === 'message' && e.message.type === 'text')
      .map(async (event) => {
        const ctx = await bot.handle({
          text: event.message.text,
          userId: event.source.userId,
          event,
        });
        if (ctx.reply) {
          await lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text: ctx.reply,
          });
        }
      })
  );

  res.sendStatus(200);
});
module.exports = app;
