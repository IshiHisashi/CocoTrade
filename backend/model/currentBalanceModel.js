import mongoose from "mongoose";

//   Shcema
const { Schema } = mongoose;

const currentBalanceSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  purchases_array: {
    type: Array,
    ref: "Purchase",
  },
  purchases_sum: mongoose.Types.Decimal128,
  sales_array: {
    type: Array,
    ref: "Sale",
  },
  sales_sum: mongoose.Types.Decimal128,
  current_balance: mongoose.Types.Decimal128,
  date: Date,
});

export const CurrentBalanceModel = mongoose.model(
  "Current_Balance",
  currentBalanceSchema
);

export default CurrentBalanceModel;
