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

app.post(`/line`,
    line.middleware(config),
    async (req, res) => {
        res.json({});
    }
);
module.exports = app;
