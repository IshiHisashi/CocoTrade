import mongoose from "mongoose";

<<<<<<< HEAD
// this file is created by Sacha.

const Schema = mongoose.Schema;
const marketPriceSchema = new Schema(
=======
const Schema = mongoose.Schema;
const marketpriceSchema = new Schema(
>>>>>>> c39d9b7995964f5aefb078b72d342cf3bcaea393
  {
    price_USD: mongoose.Types.Decimal128,
    price_PHP: mongoose.Types.Decimal128,
    exchange_rate: mongoose.Types.Decimal128,
<<<<<<< HEAD
  },
  { timestamps: true }
);

export const MarketPriceModel = mongoose.model(
  "Market_Price",
  marketPriceSchema
=======
    price_suggestion: mongoose.Types.Decimal128,
  },
  { timestamps: true }
);
export const marketPriceModel = mongoose.model(
  "Market_Price",
  marketpriceSchema
>>>>>>> c39d9b7995964f5aefb078b72d342cf3bcaea393
);
