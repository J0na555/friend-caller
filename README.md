# Friend Caller Bot

A **Telegram bot** that helps you remember to call your friends regularly.
Perfect for people like me who never call their friends unless reminded 😅.

---

## 📌 Features

* Add, list, edit, and delete friends
* Set custom calling frequency per friend
* Daily reminders for friends due for a call
* Mark friends as called to update logs
* `/due` command to see who you need to call today
* `/help` command for quick command reference

---

## ⚡ Commands

| Command             | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `/list`             | Show all friends with their calling frequency and last call date |
| `/add <name> <Xd>`  | Add a friend (e.g., `/add Abel 7d`)                              |
| `/delete <name>`    | Remove a friend                                                  |
| `/edit <name> <Xd>` | Update the calling frequency for a friend                        |
| `/done <name>`      | Mark that you called a friend today                              |
| `/due`              | Show friends due for a call today                                |
| `/help`             | Show all available commands                                      |

---

## 🛠️ Setup

1. **Clone the repo**

```bash
git clone https://github.com/J0na555/friend-caller.git
cd friend-caller
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file**

```env
BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_telegram_user_id
```

* Get your **BOT\_TOKEN** from [BotFather](https://t.me/BotFather).
* Get your **CHAT\_ID** by messaging your bot or using [@userinfobot](https://t.me/userinfobot).

4. **Create the `friends.json` file**

```json
[]
```

5. **Run the bot**

```bash
node index.js
```

* The bot polls Telegram for commands and sends daily reminders at **9 AM** by default.
* For testing, you can temporarily change the cron schedule to `* * * * *` (every minute).

---

## 🏗️ Tech Stack

* **Node.js**
* **node-telegram-bot-api** → Telegram API client
* **node-cron** → Scheduling daily reminders
* **fs** → JSON-based friend storage

---

## ⚙️ Future Improvements

* Add **notes per call** for each friend
* Snooze or reschedule reminders
* Track **streaks / stats** of calls
* Host on **Render / Railway / Fly.io** for 24/7 reminders
* Web or mobile dashboard for managing friends

---

## 📄 License

MIT License © 2025 Jonas

---