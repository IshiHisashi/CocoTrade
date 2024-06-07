import mongoose from "mongoose";

export {
    Purchase
};

const Schema = mongoose.Schema;
const purchaseSchema = new Schema({
    user_id: Array,
    farmer_id: Array,
    amount_of_copra_purchased: mongoose.Types.Decimal128,
    moisture_test_result: Boolean,
    moisture_test_details: mongoose.Types.Decimal128,
    total_purchase_price: mongoose.Types.Decimal128
});
const Purchase = mongoose.model('Purchase', purchaseSchema);