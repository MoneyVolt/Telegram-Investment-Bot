
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const sqlite3 = require("sqlite3").verbose();

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Initialize Database
const db = new sqlite3.Database("db.sqlite");

// Handle /start Command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.chat.first_name;

    // Check if user exists
    db.get("SELECT * FROM users WHERE telegram_id = ?", [chatId], (err, row) => {
        if (row) {
            bot.sendMessage(chatId, `Welcome back, ${row.name}! Your balance is $${row.balance}.`);
        } else {
            // Add new user
            db.run("INSERT INTO users (telegram_id, name) VALUES (?, ?)", [chatId, name], (err) => {
                if (!err) {
                    bot.sendMessage(chatId, `Welcome, ${name}! You have been registered.`);
                }
            });
        }
    });
});

// Handle /invest Command
bot.onText(/\/invest (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const amount = parseFloat(match[1]);

    // Add investment
    db.get("SELECT id FROM users WHERE telegram_id = ?", [chatId], (err, row) => {
        if (row) {
            db.run("INSERT INTO investments (user_id, amount) VALUES (?, ?)", [row.id, amount], (err) => {
                if (!err) {
                    bot.sendMessage(chatId, `You have successfully invested $${amount}.`);
                }
            });
        } else {
            bot.sendMessage(chatId, "Please register first by using /start.");
        }
    });
});

// Handle /balance Command
bot.onText(/\/balance/, (msg) => {
    const chatId = msg.chat.id;

    db.get("SELECT balance FROM users WHERE telegram_id = ?", [chatId], (err, row) => {
        if (row) {
            bot.sendMessage(chatId, `Your current balance is $${row.balance}.`);
        } else {
            bot.sendMessage(chatId, "Please register first by using /start.");
        }
    });
});

// Handle /withdraw Command
bot.onText(/\/withdraw (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const amount = parseFloat(match[1]);

    db.get("SELECT balance FROM users WHERE telegram_id = ?", [chatId], (err, row) => {
        if (row && row.balance >= amount) {
            const newBalance = row.balance - amount;
            db.run("UPDATE users SET balance = ? WHERE telegram_id = ?", [newBalance, chatId], (err) => {
                if (!err) {
                    bot.sendMessage(chatId, `You have successfully withdrawn $${amount}. Your new balance is $${newBalance}.`);
                }
            });
        } else {
            bot.sendMessage(chatId, "Insufficient balance or please register first.");
        }
    });
});
    