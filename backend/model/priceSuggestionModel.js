import mongoose from "mongoose";

const Schema = mongoose.Schema;

const priceSuggestionSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price_suggestion: mongoose.Types.Decimal128,
  },
  { timestamps: true }
);

export const PriceSuggestionModel = mongoose.model(
  "Price_Suggestion",
  priceSuggestionSchema
);
