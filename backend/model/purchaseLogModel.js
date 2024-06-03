import mongoose from "mongoose";

// this file is created by Sacha.

const Schema = mongoose.Schema;
const purchaseLogSchema = new Schema({
  user_id: String,
  farmer_id: String,
  purchase_date: Date,
  amount_purchased: mongoose.Types.Decimal128,
  moisture_test: Boolean,
  moisture_test_detail: mongoose.Types.Decimal128,
  purchase_price: mongoose.Types.Decimal128,
});

export const PurchaseLogModel = mongoose.model(
  "S_Purchase_Log",
  purchaseLogSchema
);
