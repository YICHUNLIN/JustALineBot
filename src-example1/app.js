require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
}

// 你的 Webhook 路由
app.post('/line', line.middleware(config), async (req, res) => {
    try {
        const events = req.body.events;

        // 同時處理多個非同步事件
        await Promise.all(events.map(handleEvent));

        // LINE 伺服器收到 200 回應才會判定發送成功
        res.status(200).json({});
    } catch (err) {
        console.error('處理事件時發生錯誤:', err);
        res.status(500).end();
    }
});

// 主事件分流器 (Event Handler)
async function handleEvent(event) {
    const replyToken = event.replyToken;
    const userId = event.source.userId;

    switch (event.type) {
        // 1. 訊息事件
        case 'message':
            return await handleMessageEvent(event);

        // 2. 追蹤/加好友事件
        case 'follow':
            console.log(`使用者 ${userId} 加了好友`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: '感謝你將我加入好友！這裡可以提供各式服務喔！' }]
            });

        // 3. 解除追蹤/封鎖事件
        case 'unfollow':
            // 注意：封鎖事件沒有 replyToken，無法回覆訊息
            console.log(`使用者 ${userId} 封鎖了機器人`);
            return null;

        // 4. 加入群組/多人聊天室事件
        case 'join':
            console.log(`機器人加入了群組/聊天室: ${event.source.groupId || event.source.roomId}`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: '大家好！很高興能加入這個群組，請多指教！' }]
            });

        // 5. 離開群組事件
        case 'leave':
            // 沒有 replyToken
            console.log(`機器人離開了群組/聊天室: ${event.source.groupId || event.source.roomId}`);
            return null;

        // 6. 群組有新成員加入
        case 'memberJoined':
            console.log(`有新成員加入群組`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: '歡迎新朋友加入群組！' }]
            });

        // 7. 群組有成員離開
        case 'memberLeft':
            console.log(`有成員離開群組`);
            return null;

        // 8. Postback 回呼事件 (點擊圖文選單、按鈕等)
        case 'postback':
            const data = event.postback.data; // 取得自訂夾帶的資料
            console.log(`收到 Postback 資料: ${data}`);
            
            // 如果有使用 datetime picker (時間選擇器)
            let paramsText = '';
            if (event.postback.params) {
                paramsText = `，選擇的時間是: ${JSON.stringify(event.postback.params)}`;
            }

            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: `已收到您的選單指令: ${data}${paramsText}` }]
            });

        // 9. Beacon 藍牙事件
        case 'beacon':
            const hwid = event.beacon.hwid;
            const beaconType = event.beacon.type; // enter, leave, banner
            console.log(`偵測到 Beacon: ${hwid}, 動作: ${beaconType}`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: `歡迎來到 LINE Beacon 實體導客範圍！` }]
            });

        // 10. 訊息收回事件
        case 'unsend':
            console.log(`使用者收回了訊息，訊息 ID: ${event.unsend.messageId}`);
            return null;

        // 11. 影片觀看完成事件
        case 'videoPlayComplete':
            console.log(`使用者看完了影片，TrackingId: ${event.videoPlayComplete.trackingId}`);
            return null;

        default:
            console.log(`未知的事件類型: ${event.type}`);
            return null;
    }
}

// 訊息事件分流器 (Message Type Handler)
async function handleMessageEvent(event) {
    const replyToken = event.replyToken;
    const message = event.message;

    switch (message.type) {
        // 文字訊息
        case 'text':
            console.log(`收到文字訊息: ${message.text}`);
            // 鸚鵡學舌範例
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: `你剛剛說了：${message.text}` }]
            });

        // 圖片訊息
        case 'image':
            console.log(`收到圖片訊息，ID: ${message.id}`);
            // 可以透過 client.getMessageContent(message.id) 下載二進位檔案
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: '這是一張很棒的圖片！已成功接收。' }]
            });

        // 影片訊息
        case 'video':
            console.log(`收到影片訊息，ID: ${message.id}`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: '收到影片了，謝謝分享！' }]
            });

        // 音訊訊息
        case 'audio':
            console.log(`收到語音訊息，ID: ${message.id}`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: '收到語音訊息了！' }]
            });

        // 檔案訊息
        case 'file':
            console.log(`收到檔案: ${message.fileName}, 大小: ${message.fileSize}`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: `已收到檔案：${message.fileName}` }]
            });

        // 位置訊息
        case 'location':
            console.log(`收到位置 - 地址: ${message.address}, 緯度: ${message.latitude}, 經度: ${message.longitude}`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [{ type: 'text', text: `收到位置！你在 ${message.address} 對吧？` }]
            });

        // 貼圖訊息
        case 'sticker':
            console.log(`收到貼圖 - PackageId: ${message.packageId}, StickerId: ${message.stickerId}`);
            return await client.replyMessage({
                replyToken: replyToken,
                messages: [
                    { type: 'text', text: '好可愛的貼圖，回送你一個！' },
                    { type: 'sticker', packageId: '11537', stickerId: '52002734' } // LINE 預設基本貼圖
                ]
            });

        default:
            console.log(`未知的訊息類型: ${message.type}`);
            return null;
    }
}
module.exports = app;
