import mongoose from "mongoose";

// this file is created by Sacha.

const Schema = mongoose.Schema;
const currentBalanceSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "S_User",
  },
  purchases_array: {
    type: Array,
    // ref: "S_Purchase_Logs"
  },
  purchases_sum: mongoose.Types.Decimal128,
  sales_array: {
    type: Array,
    // ref: "S_Sales_Logs"
  },
  sales_sum: mongoose.Types.Decimal128,
  current_balance: mongoose.Types.Decimal128,
  date: Date,
});

export const CurrentBalanceModel = mongoose.model(
  "S_Current_Balance",
  currentBalanceSchema
);
