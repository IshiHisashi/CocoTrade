import mongoose from "mongoose";

// this file is created by Sacha.

const Schema = mongoose.Schema;
const currentBalanceSchema = new Schema({
  user_id: String,
  purchases_array: Array,
  purchases_sum: mongoose.Types.Decimal128,
  sales_array: Array,
  sales_sum: mongoose.Types.Decimal128,
  current_balance: mongoose.Types.Decimal128,
  date: Date,
});

export const CurrentBalanceModel = mongoose.model(
  "S_Current_Balance",
  currentBalanceSchema
);
