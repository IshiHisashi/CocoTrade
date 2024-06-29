import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: String,
  company_name: String,
  full_name: String,
  country: String,
  email: String,
  email_verification: Boolean,
  currency: String,
  margin: mongoose.Types.Decimal128,
  max_inventory_amount: Number,
  amount_per_ship: Number,
  purchases_array: [{ type: Schema.Types.ObjectId, ref: "Purchase" }],
  farmers_array: [{ type: Schema.Types.ObjectId, ref: "Farmer" }],
  sales_array: [{ type: Schema.Types.ObjectId, ref: "Sale" }],
  manufacturers_array: [{ type: Schema.Types.ObjectId, ref: "Manufacturer" }],
  notification_setting: Boolean,
  notification_array: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  inventory_amount_array: [{ type: Schema.Types.ObjectId, ref: "Inventory" }],
  balance_array: [{ type: Schema.Types.ObjectId, ref: "Current_Balance" }],
  price_suggestion_array: [
    { type: Schema.Types.ObjectId, ref: "Price_Suggestion" },
  ],
});

export const UserModel = mongoose.model("User", userSchema);

export default UserModel;
