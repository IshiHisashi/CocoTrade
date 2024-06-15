import mongoose from "mongoose";

export { Purchase };

const {Schema} = mongoose;
const purchaseSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  farmer_id: { type: Schema.Types.ObjectId, ref: "Farmer" },
  invoice_number: { type: String, unique: true },
  purchase_date: Date,
  amount_of_copra_purchased: mongoose.Types.Decimal128,
  moisture_test_details: mongoose.Types.Decimal128,
  total_purchase_price: mongoose.Types.Decimal128,
});

// Pre-save hook to generate invoice number
purchaseSchema.pre('save', function (next) {
  if (!this.invoice_number) {
    this.invoice_number = generateInvoiceNumber();
  }
  next();
});

const generateInvoiceNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'IN';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const Purchase = mongoose.model("Purchase", purchaseSchema);
