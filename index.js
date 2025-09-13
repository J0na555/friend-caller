require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const cron = require('node-cron')
const fs = require('fs')

//config
const BOT_TOKEN = process.env.BOT_TOKEN
const CHAT_ID = process.env.CHAT_ID
const bot = new TelegramBot(BOT_TOKEN, {polling: true})

// load(create) friends
let friends = []
if (fs.existsSync('friends.json')) {
    friends = JSON.parse(fs.readFileSync('friends.json'))
}else {
    fs.writeFileSync('friends.json', JSON.stringify([], null, 2))
}

function saveFriends(){
    fs.writeFileSync('friends.json', JSON.stringify(friends, null, 2))
}

function formatDate(date){
    return new Date(date).toISOString().split('T')[0]
}

function nextCallDate(friend){
    const last = new Date(friend.last_called)
    const freqDays = parseInt(friend.frequency.replace('d', ''), 10)
    const next = new Date(last)     
    next.setDate(last.getDate() + freqDays)
    return next
}


// daily reminder at 9AM
cron.schedule('0 9 * * *', () => {
    const today = new Date()
    const dueFriends = friends.filter(f => today >= nextCallDate(f))

    if (dueFriends.length > 0){
        let msg = "📞 Calls Due Today:\n"
        dueFriends.forEach(f => {
            msg += `- ${f.name} (every ${f.frequency})\n`
        })
        bot.sendMessage(CHAT_ID, msg)
    }
})

// /list
bot.onText(/\/list/,msg => {
    if (friends.length === 0) return bot.sendMessage(msg.chat.id, "👥 No friends yet.")
    let list =  "👥 Friends List:\n"
    friends.forEach((f, i) => {
        list += `${i + 1}. ${f.name} — every ${f.frequency} (last: ${f.last_called})\n`
    })
    bot.sendMessage(msg.chat.id, list)
})

// /add <name> <frequency>
bot.onText(/\/add (.+) (\d+d)/, (msg, match) => {
    const name = match[1].trim()
    const frequency = match[2]
    friends.push({name, frequency, last_called: formatDate(new Date())})
    saveFriends()
    bot.sendMessage(msg.chat.id, `✅ Added ${name} (every ${frequency})`)
})

// /done <name>
bot.onText(/\/done (.+)/, (msg, match) => {
    const name = match[1].trim()
    const friend = friends.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (friend){
        friend.last_called = formatDate(new Date())
        saveFriends()
        bot.sendMessage(msg.chat.id, `✅ Marked ${friend.name} as called today.`)
    }else{
        bot.sendMessage(msg.chat.id, `⚠️ Friend ${name} not found.`)
    }
})


// /delete <name>
bot.onText(/\/delete (.+)/, (msg, match) => {
    const name = match[1].trim()
    const before = friends.length
    friends = friends.filter(f => f.name.toLowerCase() !== name.toLowerCase())
    if (friends.length < before){
        saveFriends()
        bot.sendMessage(msg.chat.id, `🗑️ Deleted ${name}`)
    }else{
        bot.sendMessage(msg.chat.id, `⚠️ Friend ${name} not found.`)
    }
})

// /edit <name> <newFrequency>
bot.onText(/\/edit (.+) (\d+d)/, (msg, match) => {
    const name = match[1].trim()
    const newFreq = match[2]
    const friend = friends.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (friend){
        friend.frequency = newFreq
        saveFriends()
        bot.sendMessage(msg.chat.id, `✏️ Updated ${name} to frequency ${newFreq}`)
    }else{
        bot.sendMessage(msg.chat.id, `⚠️ Friend ${name} not found.`)
    }
})

// /due 
bot.onText(/\/due/, msg => {
    const today = new Date()
    const dueFriends = friends.filter(f => today >= nextCallDate(f))
    if(dueFriends.length === 0){
        bot.sendMessage(msg.chat.id, "🎉 No calls due today!")
    }else{
        let msgText = "📞 Calls Due Today:\n"
        dueFriends.forEach(f => msgText += `- ${f.name}\n`)
        bot.sendMessage(msg.chat.id, msgText)
    }
})

// /help

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id,
      `📌 Commands:
      /list - Show all friends
      /add <name> <Xd> - Add friend (e.g. /add Abel 7d)
      /delete <name> - Delete friend
      /edit <name> <Xd> - Edit frequency
      /done <name> - Mark call done
      /due - Show due calls today
      /help - Show this menu`
    )
})