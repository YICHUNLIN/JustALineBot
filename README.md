JustALineBot
===

# 安裝 ngrok

```
ngrok http 9999
```

# 註冊 linebot 與 webhook

[Line console](https://developers.line.biz/console)

> access token

![image](https://github.com/YICHUNLIN/JustALineBot/blob/main/assert/accesstoken.png)

> secret

![image](https://github.com/YICHUNLIN/JustALineBot/blob/main/assert/secret.png)

> webhook

![image](https://github.com/YICHUNLIN/JustALineBot/blob/main/assert/webhook.png)




## .env

```
LINE_CHANNEL_ACCESS_TOKEN=<TOKEN>
LINE_CHANNEL_SECRET=<SECRET>
PORT=9999
```


# 起手式

1. 從.env取得accesstoken 與 secret
2. 注入line的middleware

```
require('dotenv').config();
const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
}

app.post(`/line`,
    line.middleware(config),
    async (req, res) => {
        res.json({});
    }
);

```