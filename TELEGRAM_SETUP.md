# APK OFFICE — Telegram App Request Setup

The App Request form now sends its data to `/api/request`.
The backend then sends the request to your Telegram chat through the Telegram Bot API.

## 1) Create the Telegram bot
Open @BotFather in Telegram and create a bot with `/newbot`.
Keep the bot token private. NEVER put it inside `apk_office_preview.html`.

## 2) Get your Telegram chat ID
Open your new bot from your Telegram account and press Start / send `/start`.
Then, before configuring a webhook, call:

https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates

Find the latest update's `message.chat.id`. That number is your `TELEGRAM_CHAT_ID`.

If getUpdates is empty, send another `/start` to the bot and try again.

## 3) Deploy
This project uses a Vercel-style serverless function:
- `api/request.js`
- `apk_office_preview.html`

Set these environment variables in your hosting provider:

TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_numeric_chat_id

Do not put either value in frontend JavaScript.

## 4) Result
Visitor fills:
- App name
- Category
- Official link (optional)
- Note

The website POSTs the data to `/api/request`, and the backend calls Telegram's `sendMessage` API.

## Important
A normal Telegram username such as @AOdev_mahin is not enough for server-side bot delivery.
The bot needs the numeric chat ID of the Telegram account/chat that has started the bot.
