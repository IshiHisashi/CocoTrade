import mongoose from "mongoose";

const Schema = mongoose.Schema;
const marketpriceSchema = new Schema({
  price_USD: mongoose.Types.Decimal128,
  price_PHP: mongoose.Types.Decimal128,
  exchange_rate: mongoose.Types.Decimal128,
  price_suggestion: mongoose.Types.Decimal128,
  date: Date,
});
export const marketPriceModel = mongoose.model(
  "Market_Price",
  marketpriceSchema
);
