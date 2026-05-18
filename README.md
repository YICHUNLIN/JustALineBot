JustALineBot
===

# about

此專案為 Line bot Message API 基本的使用方法,以及方便區分指令的方法

# 安裝 ngrok

ngrok -> [在這](https://ngrok.com/)

```
ngrok http 9999
```

# 註冊 linebot 與 webhook

傳送門 -> [Line console](https://developers.line.biz/console)

> access token

![image](https://github.com/YICHUNLIN/JustALineBot/blob/main/assert/accesstoken.png)

> secret

![image](https://github.com/YICHUNLIN/JustALineBot/blob/main/assert/secret.png)

> webhook

![image](https://github.com/YICHUNLIN/JustALineBot/blob/main/assert/webhook.png)

* 設定完可以按Verfy 看看有沒有成功


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

# 正題

## 先說明怎麼使用linebot

```
app.post(`/line`,
    line.middleware(config),
    async (req, res) => {
        // line bot webhook進入點在此
        res.json({});
    }
);
```
* 在進入點後對於event進行工作分配

1. 聊天基本事件
這類事件最常出現在一對一聊天或群組中，代表使用者主動發起的動作：

Message Event（訊息事件）： 當使用者傳送訊息時觸發。這是最常用的事件，包含以下類型：

* 文字（Text）
* 圖片（Image）
* 影片（Video）
* 音訊（Audio）
* 檔案（File）
* 位置訊息（Location）
* 貼圖（Sticker）

Unsend Event（收回訊息事件）： 當使用者在聊天室「收回」他們發過的訊息時觸發。

2. 帳號狀態與好友事件
當使用者與你的 LINE 帳號關係發生改變時觸發：

* Follow Event（追蹤/加好友事件）： 當使用者將你的 LINE 官方帳號加為好友，或是解除封鎖時觸發。通常會在此時發送「歡迎訊息」。

* Unfollow Event（封鎖事件）： 當使用者封鎖你的官方帳號時觸發。（注意：此事件無法回覆訊息給使用者）。

3. 群組與多人聊天室事件
當 LINE Bot 被加入或踢出群組（Group / Room）時的相關事件：

* Join Event（加入群組事件）： 當機器人被邀請並加入某個群組或聊天室時觸發。

* Leave Event（離開群組事件）： 當機器人被踢出或主動離開群組時觸發。

* Member Join Event（成員加入事件）： 當機器人已經在群組中，而有新的人（其他使用者）加入該群組時觸發。

* Member Leave Event（成員離開事件）： 當群組內有其他成員離開或退出時觸發。

4. 進階互動與系統事件
用於更複雜的功能開發（如圖文選單、硬體互動等）：

* Postback Event（回呼事件）： 當使用者點擊了 Rich Menu（圖文選單）、Template Message（樣板訊息） 或 Flex Message 中的按鈕，且該按鈕觸發了 postback 動作時觸發。它可以夾帶隱藏的資料（Data）或時間選擇器（Datetime picker）的結果，是打造機器人選單、流程切換的核心。

* Video Viewing Complete Event（影片播放完畢事件）： 當使用者看完整支官方帳號傳送的追蹤影片（有指定 trackingId 的影片）時觸發。

* Beacon Event（藍牙訊號事件）： 當使用者走近或離開設定好的 LINE Beacon（藍牙發射器）硬體範圍內時觸發，可用於線下實體店面的 O2O 導客。

* Account Link Event（帳號連結事件）： 用於安全地將使用者的 LINE 帳號與你自家網站的會員系統（或外部服務）進行帳號綁定時觸發。

> 範例1

此範例為基本的line bot 介接,以及對於每個event的處理與使用方法

```
cd src-example1
npm start

```

> 範例2 

* 套用Onion Strategy
* 為什麼要用這個?
    * 不然你會有一大堆 if else, 或是 switch case

[OnionStrategy](https://github.com/YICHUNLIN/onion-strategy)



```
cd src-onion
npm start
```
