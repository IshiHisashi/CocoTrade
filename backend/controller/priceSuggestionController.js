import { PriceSuggestionModel } from "../model/priceSuggestionModel.js";

// Create
export const createPriceSuggestion = async (req, res) => {
  try {
    const { userid } = req.params;

    const resUserDoc = await fetch(`http://localhost:5555/user/${userid}`);
    const margin = Number(resUserDoc.data.data.margin.$numberDecimal);

    // modify the URL according to Ishi's code.
    const resMarketPriceDoc = await fetch(
      `http://localhost:5555/user/${userid}/marketprice`
    );
    // pricePHP is in ton.
    const pricePHP = Number(resMarketPriceDoc.data.data.price_PHP);
    const pricePHPInKg = pricePHP / 1000;
    const priceSuggestion = pricePHPInKg * (1 + margin);
    // priceSuggestion is in kg.

    const newDoc = {
      userID: userid,
      price_suggestion: priceSuggestion,
    };

    const newPriceSuggestion = await PriceSuggestionModel.create(newDoc);
    res.status(201).json({
      status: "success",
      data: newPriceSuggestion,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Read
export const readPriceSuggestion = async (req, res) => {
  try {
    // look for the most resent record and 7 days ago one
    // but this depends on how often the data will be posted
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
