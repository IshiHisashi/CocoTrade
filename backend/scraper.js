import axios from "axios";
import cheerio from "cheerio";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });

const postData = async (priceUSD, pricePHP, exchangeRate) => {
  try {
    const res = await axios.post("http://localhost:5555/marketprice", {
      price_USD: priceUSD,
      price_PHP: pricePHP,
      exchange_rate: exchangeRate,
    });
    console.log("data posted successfully", res.data);
  } catch (error) {
    console.log("Error posting data: ", error.message);
  }
};

const convertCurrency = async (priceUSD) => {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGEAPI}/latest/USD`
    );
    const data = await res.json();
    const exchangeRate = data.conversion_rates.PHP;
    const pricePHP = priceUSD * exchangeRate;
    // pricePHP is in ton.
    return { pricePHP, exchangeRate };
  } catch (error) {
    console.log("Error converting currency: ", error.message);
  }
};

const scraper = async () => {
  try {
    const res = await axios.get(
      "https://markets.businessinsider.com/commodities/palm-oil-price"
    );
    const $ = cheerio.load(res.data);
    const price = $(".price-section__current-value").text();
    const priceUSD = Number(price);
    // priceUSD is in ton.
    return priceUSD;
  } catch (error) {
    console.log("Error scraping data: ", error.message);
  }
};

// schedule to execute everyday at 0 o'clock.
cron.schedule("0 0 0 * * *", async () => {
  const priceUSD = await scraper();
  const { pricePHP, exchangeRate } = await convertCurrency(priceUSD);
  postData(priceUSD, pricePHP, exchangeRate);
});
