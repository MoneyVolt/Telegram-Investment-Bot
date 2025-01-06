import os
from telegram import Update, Bot
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

TOKEN = os.getenv("TELEGRAM_TOKEN")

def start(update: Update, context: CallbackContext):
    update.message.reply_text("Welcome to the Investment Bot! Please use /login or /signup to get started.")

def login(update: Update, context: CallbackContext):
    update.message.reply_text("Login functionality coming soon.")

def signup(update: Update, context: CallbackContext):
    update.message.reply_text("Signup functionality coming soon.")

def main():
    bot = Bot(token=TOKEN)
    updater = Updater(bot=bot, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("login", login))
    dp.add_handler(CommandHandler("signup", signup))

    updater.start_polling()
    updater.idle()

if __name__ == "__main__":
    main()
