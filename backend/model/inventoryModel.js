import mongoose from "mongoose";

export {
    Inventory
};

const Schema = mongoose.Schema;
const inventorySchema = new Schema({
    user_id: String,
    purchase_id: Array,
    sales_id: Array,
    current_amount: Number,
    time_stamp: Date
});
const Inventory = mongoose.model('Inventory', inventorySchema);