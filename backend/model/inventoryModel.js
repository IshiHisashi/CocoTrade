import mongoose from "mongoose";

export {
    Inventory
};

const {Schema} = mongoose;
const inventorySchema = new Schema({
    user_id: { type: Schema.Types.ObjectId },
    purchase_array: [{ type: Schema.Types.ObjectId, ref: "Purchase" }],
    sales_array: [{ type: Schema.Types.ObjectId, ref: "Sale" }],
    current_amount: mongoose.Types.Decimal128,
    time_stamp: Date
});

const Inventory = mongoose.model('Inventory', inventorySchema);