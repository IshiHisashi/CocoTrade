import axios from "axios";
import cheerio from "cheerio";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config({ path: "../config.env" });

const URL = "http://localhost:5555";

const postDataToPriceSuggestion = async () => {
  try {
    const res = await axios.get(`${URL}/user`);
    res.data.data.forEach(async (userId) => {
      try {
        const resPriceSuggestionPost = await axios.post(
          `${URL}/user/${userId}/pricesuggestion`
        );

        // update price-suggestion-array in the user's doc
        await axios.patch(`${URL}/user/${userId}`, {
          price_suggestion_array: {
            action: "push",
            value: resPriceSuggestionPost.data.data._id,
          },
        });
      } catch (error) {
        console.log(
          `Error posting price suggestion data for user ${userId}: ${error.message}`
        );
      }
    });
  } catch (error) {
    console.log("Error getting all users: ", error.message);
  }
};

const postDataToMarketPrice = async (priceUSD, pricePHP, exchangeRate) => {
  try {
    const res = await axios.post(`${URL}/marketprice`, {
      price_USD: priceUSD,
      price_PHP: pricePHP,
      exchange_rate: exchangeRate,
    });
  } catch (error) {
    console.log("Error posting data: ", error.message);
  }
};

const convertCurrency = async (priceUSD) => {
  try {
    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGEAPI}/latest/USD`
    );
    const exchangeRate = res.data.conversion_rates.PHP;
    const pricePHP = priceUSD * exchangeRate;
    // pricePHP is in ton.
    return { pricePHP, exchangeRate };
  } catch (error) {
    console.log("Error converting currency: ", error.message);
    return null;
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
    return null;
  }
};

// schedule to execute everyday at 0 o'clock.
// cron.schedule("0 0 0 * * *",
export default async function handler() {
  const priceUSD = await scraper();
  const { pricePHP, exchangeRate } = await convertCurrency(priceUSD);
  await postDataToMarketPrice(priceUSD, pricePHP, exchangeRate);
  postDataToPriceSuggestion();
}
// );
