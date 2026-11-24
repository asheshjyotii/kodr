import mongoose from 'mongoose';

/**
 * Payment Schema:
 * Har transaction ka record MongoDB me save karne ke liye
 */
const paymentSchema = new mongoose.Schema(
  {
    // Razorpay se jo unique order_id milti hai (e.g. order_NZ123...)
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    // Payment success hone ke baad jo payment_id milti hai (e.g. pay_NZ123...)
    paymentId: {
      type: String,
      default: null,
    },
    // Razorpay jo secret signature bhejta hai
    signature: {
      type: String,
      default: null,
    },
    // Transaction amount in Rupees
    amount: {
      type: Number,
      required: true,
    },
    // Currency (default: INR)
    currency: {
      type: String,
      default: 'INR',
    },
    // Status: pending -> completed / failed
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true } // automatically createdAt aur updatedAt add karega
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;