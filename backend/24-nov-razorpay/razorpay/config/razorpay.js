import Razorpay from 'razorpay';
import 'dotenv/config';

/**
 * Razorpay Instance Setup
 * Test mode keys .env file se aayengi
 */
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpayInstance;