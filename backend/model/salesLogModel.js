import mongoose from "mongoose";

// this file is created by Sacha.

const Schema = mongoose.Schema;
const salesLogSchema = new Schema({
  user_id: String,
  manufacturer_id: String,
  amount_sold: mongoose.Types.Decimal128,
  status: String,
  copra_ship_date: Date,
  cheque_recieve_date: Date,
  sales_price: mongoose.Types.Decimal128,
});

export const SalesLogModel = mongoose.model("S_Sales_Log", salesLogSchema);
