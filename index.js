import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import schedule from "node-schedule";
import dotenv from "dotenv";
dotenv.config();

// create an .env file to store all the environment variables (telegram api token, apiurl, telegram admin id)
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
let apiUrl = process.env.APIURL;
let adminId = process.env.ADMIN;
let priceThreshold = 0.98;

/**
 * this function is a scheduled job that runs every 60 seconds. It checks the current price of
 * Gemini USD and if it is below the price threshold, it sends a message to the admin.
 */
const executeScheduler = async () => {
  schedule.scheduleJob("*/60 * *  * * *", async () => {
    axios.get(apiUrl).then(async (response) => {
      let price = response.data[0].current_price;
      let low = response.data[0].low_24h;
      if (price <= priceThreshold || low <= priceThreshold) {
        bot.sendMessage(
          adminId,
          `Warning Gemini Usd price is below threshold of $${priceThreshold}. Current Price @ $${price}\n24h Low: $${low}`
        );
      }
    });
  });
};

executeScheduler();
