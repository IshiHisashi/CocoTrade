import mongoose from "mongoose";

const { Schema } = mongoose;
const marketpriceSchema = new Schema(
  {
    price_USD: mongoose.Types.Decimal128,
    price_PHP: mongoose.Types.Decimal128,
    exchange_rate: mongoose.Types.Decimal128,
    price_suggestion: mongoose.Types.Decimal128,
  },
  { timestamps: true }
);
export const marketPriceModel = mongoose.model(
  "Market_Price",
  marketpriceSchema
);

export default marketPriceModel;
