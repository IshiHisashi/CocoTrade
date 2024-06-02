import mongoose from "mongoose";

export {
    User
};

const Schema = mongoose.Schema;
const userSchema = new Schema({
    com_name: String,
    full_name: String,
    email: String,
    email_vrfc: Boolean,
    currency: String,
    margin: Number,
    max_inventory: Number,
    per_shipment: Number,
    notification: Boolean,
    purchase_array: Array,
    sales_array: Array,
    inventory_array: Array,
    balance_array: Array,
    farmers_array: Array,
    manufacturers_array: Array
});
const User = mongoose.model('User', userSchema);