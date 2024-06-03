import mongoose from "mongoose";

const Schema = mongoose.Schema;
const marketPriceSchema = new Schema(
  {
    price_USD: mongoose.Types.Decimal128,
    price_PHP: mongoose.Types.Decimal128,
  },
  { timestamps: true }
);

export const MarketPriceModel = mongoose.model(
  "S_Market_Price",
  marketPriceSchema
);
