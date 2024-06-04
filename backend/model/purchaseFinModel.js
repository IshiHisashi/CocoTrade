import mongoose from "mongoose";

//   Shcema
const Schema = mongoose.Schema;
const purchaseFinSchema = new Schema({
  // sale_log_id: String,
  // user_id: Array,
  // manufacturer_id: Array,
  // amount_of_copra_sold: Number,
  purchase_date: Date,
  // cheque_receive_date: Date,
  total_purchase_price: Number,
});
export const purchaseFinmodel = mongoose.model(
  "ishi_purchaseFinmodel",
  purchaseFinSchema
);
