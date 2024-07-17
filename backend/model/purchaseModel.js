import mongoose from "mongoose";

export { Purchase };

const { Schema } = mongoose;
const purchaseSchema = new Schema({
  user_id: {
    type: String,
    //  ref: "User"
  },
  invoice_number: String,
  farmer_id: { type: Schema.Types.ObjectId, ref: "Farmer" },
  sales_unit_price: mongoose.Types.Decimal128,
  purchase_date: Date,
  amount_of_copra_purchased: mongoose.Types.Decimal128,
  moisture_test_result: Boolean,
  moisture_test_details: mongoose.Types.Decimal128,
  total_purchase_price: mongoose.Types.Decimal128,
  createdAt: { type: Date, default: Date.now },
});
const Purchase = mongoose.model("Purchase", purchaseSchema);
