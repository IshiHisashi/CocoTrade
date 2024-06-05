import mongoose from "mongoose";

// this file is created by Sacha.

const Schema = mongoose.Schema;

// all the ref keys needs to have "ref" to use 'populate'.
const userSchema = new Schema({
  company_name: String,
  full_name: String,
  Country: String,
  email: String,
  email_verification: Boolean,
  currency: String,
  margin: mongoose.Types.Decimal128,
  max_inventory_amount: Number,
  amount_per_ship: Number,
  purchases_array: {
    type: Array,
    // ref: PurchaseLogModel
  },
  farmers_array: {
    type: Array,
    // ref: FarmersModel
  },
  sales_array: {
    type: Array,
    // ref: SalesLogModel
  },
  manufacturers_array: {
    type: Array,
    // ref: ManufacturerModel
  },
  notification_setting: Boolean,
  notification_array: {
    type: Array,
    // ref: NotificationModel
  },
  inventory_amount_array: {
    type: Array,
    // ref: InventoryAmountModel
  },
  balance_array: [{ type: Schema.Types.ObjectId, ref: "S_Current_Balance" }],
});

export const UserModel = mongoose.model("S_User", userSchema);
