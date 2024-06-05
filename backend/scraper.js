import axios from "axios";
import cheerio from "cheerio";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });

const postData = async (priceUSD, pricePHP, exchangeRate, suggestedPrice) => {
  try {
    const res = await axios.post("http://localhost:5555/marketprice", {
      price_USD: priceUSD,
      price_PHP: pricePHP,
      exchange_rate: exchangeRate,
      price_suggestion: suggestedPrice,
    });
    console.log("data posted successfully", res.data);
  } catch (error) {
    console.log("Error posting data: ", error.message);
  }
};

const calculateSuggestedPrice = async (userId, pricePHP) => {
  try {
    const res = await axios.get(`http://localhost:5555/user/${userId}`);
    const margin = Number(res.data.data.margin.$numberDecimal);
    const pricePHPInKg = pricePHP / 1000;
    const suggestedPrice = pricePHPInKg * (1 + margin);
    // suggestedPrice is in kg.
    return suggestedPrice;
  } catch (error) {
    console.log("Error getting user: ", error.message);
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
  // hardcode user ID for now
  const userId = "66605a1d4469d91be0d4401f";

  const priceUSD = await scraper();
  const { pricePHP, exchangeRate } = await convertCurrency(priceUSD);
  const suggestedPrice = await calculateSuggestedPrice(userId, pricePHP);
  postData(priceUSD, pricePHP, exchangeRate, suggestedPrice);
});
