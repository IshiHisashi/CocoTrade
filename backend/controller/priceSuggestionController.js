import { PriceSuggestionModel } from "../model/priceSuggestionModel.js";

// Create a price suggestion document
export const createPriceSuggestion = async (req, res) => {
  try {
    const { userid } = req.params;

    const resUserDoc = await fetch(`http://localhost:5555/user/${userid}`);
    const margin = Number(resUserDoc.data.data.margin.$numberDecimal);

    const resMarketPriceDoc = await fetch(
      "http://localhost:5555/marketprice/latest"
    );
    // pricePHP is in ton.
    const pricePHP = Number(resMarketPriceDoc.data.data.doc.price_PHP);
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

// Read the two most recent price suggestion documents
export const readTwoRecentPriceSuggestion = async (req, res) => {
  try {
    const { userid } = req.params;
    const docs = await PriceSuggestionModel.findById(userid)
      .populate("price_suggestion_array")
      .sort({ createdAt: -1 })
      .limit(2);
    res.status(200).json({
      status: "success",
      data: docs,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
