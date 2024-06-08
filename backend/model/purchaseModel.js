import mongoose from "mongoose";

export {
    Purchase
};

const Schema = mongoose.Schema;
const purchaseSchema = new Schema({
    purchase_log_id: String,
    user_id: Array,
    farmer_id: Array,
    amount_of_copra_purchased: Number,
    status: { type: String, enum: ['pending', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    moisture_test_result: Boolean,
    moisture_test_details: Number,
    total_purchase_price: Decimal128
});
const Purchase = mongoose.model('Purchase', purchaseSchema);