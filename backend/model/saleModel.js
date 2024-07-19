import mongoose from "mongoose";

export { Sale };

const { Schema } = mongoose;
const saleSchema = new Schema({
  user_id: {
    type: String,
    //  ref: "User"
  },
  manufacturer_id: { type: Schema.Types.ObjectId, ref: "Manufacturer" },
  amount_of_copra_sold: mongoose.Types.Decimal128,
  sales_unit_price: mongoose.Types.Decimal128,
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed", "cancelled"],
    default: "pending",
  },
  copra_ship_date: Date,
  cheque_receive_date: Date,
  total_sales_price: mongoose.Types.Decimal128,
});
const Sale = mongoose.model("Sale", saleSchema);
