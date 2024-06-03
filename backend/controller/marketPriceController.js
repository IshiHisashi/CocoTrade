import { MarketPriceModel } from "../model/marketPriceModel.js";

// Create
export const createMarketPrice = async (req, res) => {
  try {
    const newMarketPrice = await MarketPriceModel.create(req.body);
    res.status(201).send(newMarketPrice);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
