import axios from "axios";
import { PriceSuggestionModel } from "../model/priceSuggestionModel.js";
import { UserModel } from "../model/userModel.js";

// Create the very first price suggestion at the end of the onboarding
export const createFirstPriceSuggestion = async (req, res) => {
  try {
    const { userid } = req.params;
    const { margin } = req.body;

    const resMarketPriceDoc = await axios.get(
      "http://localhost:5555/marketprice/latest"
    );
    // pricePHP is in ton. convert it in kg, and calculate price suggestion.
    const pricePHP = Number(
      resMarketPriceDoc.data.data.doc.price_PHP.$numberDecimal
    );
    const pricePHPInKg = pricePHP / 1000;
    const priceSuggestion = pricePHPInKg * (1 + margin);

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

// Create a price suggestion document
export const createPriceSuggestion = async (req, res) => {
  try {
    const { userid } = req.params;

    // access to the user document to get margin,
    // and the latest market price document to get market price.
    const [resUserDoc, resMarketPriceDoc] = await Promise.all([
      axios.get(`http://localhost:5555/user/${userid}`),
      axios.get("http://localhost:5555/marketprice/latest"),
    ]);

    const margin = resUserDoc.data.data.margin
      ? Number(resUserDoc.data.data.margin.$numberDecimal)
      : 0;

    // pricePHP is in ton. convert it in kg, and calculate price suggestion.
    const pricePHP = Number(
      resMarketPriceDoc.data.data.doc.price_PHP.$numberDecimal
    );
    const pricePHPInKg = pricePHP / 1000;
    const priceSuggestion = pricePHPInKg * (1 + margin);

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

// Read one most recent price suggestion document
export const readOneRecentPriceSuggestion = async (req, res) => {
  try {
    const { userid } = req.params;
    const doc = await UserModel.findById(userid).populate({
      path: "price_suggestion_array",
      options: { sort: { createdAt: -1 }, limit: 1 },
    });
    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "Price suggestion document not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: Number(doc.price_suggestion_array[0].price_suggestion).toFixed(2),
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Read the two most recent price suggestion documents
export const readTwoRecentPriceSuggestion = async (req, res) => {
  try {
    const { userid } = req.params;
    const docs = await UserModel.findById(userid).populate({
      path: "price_suggestion_array",
      options: { sort: { createdAt: -1 }, limit: 2 },
    });
    if (!docs) {
      return res.status(404).json({
        status: "fail",
        message: "Price suggestion document not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        current: Number(
          docs.price_suggestion_array[0].price_suggestion
        ).toFixed(2),
        comparison: Number(
          docs.price_suggestion_array[1].price_suggestion
        ).toFixed(2),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
