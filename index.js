require('dotenv').config();
const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const fs = require('fs'); 

const bot = new Telegraf(process.env.BOT_TOKEN);

const shlokas = JSON.parse(fs.readFileSync('shlokas.json'));
const userFile = 'user.json';
if (!fs.existsSync(userFile)) {
    fs.writeFileSync(userFile, '[]');
}
function saveUser(chatId) {
    let users = JSON.parse(fs.readFileSync(userFile));
    if (!users.includes(chatId)) {
        users.push(chatId);
        fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
    }
}

function getRandomShloka() {
    const s = shlokas[Math.floor(Math.random() * shlokas.length)];
    return `📖 *Bhagavad Gita ${s.chapter}.${s.verse}*\n\n` +
           `🕉️ _Sanskrit:_\n${s.sanskrit}\n\n` +
           `🌐 _Translation:_\n${s.translation}\n\n` +
           `🧘 _Explanation:_\n${s.explanation}`;
}


bot.start((ctx) => {
    const chatId = ctx.chat.id;
    saveUser(chatId);
    ctx.reply('Namaste!🙏\nI will send you daily Bhagavad Geeta wisdom. \nUse /shloka to get shloka anytime.\n\n🛠️ Bot created by : Atharv96k');
});

bot.command('shloka', (ctx) => {
    ctx.replyWithMarkdown(getRandomShloka());
});

cron.schedule('0 17 * * *', () => {
    const message = getRandomShloka();
    const users = JSON.parse(fs.readFileSync(userFile));
    users.forEach(chatId => {bot.telegram.sendMessage(chatId,message,{parse_mode:'Markdown'});
});
});
bot.launch();
console.log('Bhagvat Gita Wisdom Bot is running...');
