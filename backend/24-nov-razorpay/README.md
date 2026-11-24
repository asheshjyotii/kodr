# Razorpay Payment Gateway Integration (Complete Notes)

This document contains the **exact, line-by-line code** for the entire project. Every file is provided in full with zero omissions so you can copy and paste directly into your project.

---

## 📁 Project Directory Structure

```
razorpay/
├── config/
│   ├── db.js
│   └── razorpay.js
├── controllers/
│   └── payment.controller.js
├── models/
│   └── payment.model.js
├── routes/
│   └── payment.routes.js
├── public/
│   └── index.html
├── .env
├── .env.example
├── package.json
└── server.js
```

---

## 1. `package.json`

```json
{
  "name": "razorpay-integration",
  "version": "1.0.0",
  "description": "Razorpay Payment Gateway Integration with Express.js and MongoDB (ES Modules)",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "razorpay",
    "payment-gateway",
    "express",
    "mongodb",
    "mongoose",
    "es-modules"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongoose": "^8.9.5",
    "razorpay": "^2.9.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

---

## 2. `.env.example`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/razorpay_payment_db

# Razorpay Test Credentials (from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere
RAZORPAY_KEY_SECRET=yourKeySecretHere
```

---

## 3. `config/db.js`

```javascript
import mongoose from 'mongoose';

/**
 * MongoDB Database Connection Function
 * Bahut simple and clean connection handling
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Agar DB connect na ho to server stop kar do
  }
};

export default connectDB;
```

---

## 4. `config/razorpay.js`

```javascript
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
```

---

## 5. `models/payment.model.js`

```javascript
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
```

---

## 6. `controllers/payment.controller.js`

```javascript
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';
import razorpayInstance from '../config/razorpay.js';
import Payment from '../models/payment.model.js';

/**
 * 1. Get Razorpay Key ID
 * Frontend ko public key_id dene ke liye (Secret key kabhi frontend ko nahi bhejte!)
 */
export const getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

/**
 * 2. Create Order Controller
 * Step 1: Frontend se request aati hai (amount ke saath)
 * Step 2: Razorpay API se order_id generate karte hain
 * Step 3: MongoDB me 'pending' status ke saath save karte hain
 */
export const createOrder = async (req, res) => {
  try {
    // Frontend se amount lo (agar nahi bheja to default ₹50)
    const { amount } = req.body;
    const courseAmount = amount || 50;

    // RULE: Razorpay amount ko "Paise" me leta hai
    // 1 Rupee = 100 Paise
    // ₹50 = 50 * 100 = 5000 paise
    const options = {
      amount: Number(courseAmount) * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    // A. Razorpay pe order banaya
    const order = await razorpayInstance.orders.create(options);

    // B. Database me initial order save kiya (status: 'pending')
    await Payment.create({
      orderId: order.id,
      amount: courseAmount,
      currency: order.currency,
      status: 'pending',
    });

    // C. Frontend ko order details bhej di (order.id isme hoti hai)
    res.status(200).json(order);
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Order create karne me error aaya',
      error: error.message,
    });
  }
};

/**
 * 3. Verify Payment Signature Controller
 * Step 1: Frontend payment ke baad razorpay_order_id, razorpay_payment_id aur signature bhejta hai
 * Step 2: Razorpay ke validatePaymentVerification function se signature verify karte hain
 * Step 3: Signature valid hone par payment confirmed! Status = 'completed'
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayOrderId || !razorpayPaymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, Payment ID ya Signature missing hai!',
      });
    }

    // Razorpay's official utility function to validate signature
    const isAuthentic = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );

    if (isAuthentic) {
      // Payment Successful! Database me update karo
      const payment = await Payment.findOne({ orderId: razorpayOrderId });

      if (payment) {
        payment.paymentId = razorpayPaymentId;
        payment.signature = signature;
        payment.status = 'completed';
        await payment.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully! 🎉',
      });
    } else {
      // Fake ya tampered payment! Status failed mark karo
      await Payment.findOneAndUpdate(
        { orderId: razorpayOrderId },
        { status: 'failed' }
      );

      return res.status(400).json({
        success: false,
        message: 'Invalid signature! Payment fake ya tampered ho sakti hai.',
      });
    }
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification ke waqt error aaya',
      error: error.message,
    });
  }
};

/**
 * 4. Get All Payments Controller (Optional - History dekhne ke liye)
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## 7. `routes/payment.routes.js`

```javascript
import express from 'express';
import {
  getRazorpayKey,
  createOrder,
  verifyPayment,
  getAllPayments,
} from '../controllers/payment.controller.js';

const router = express.Router();

// GET /api/payment/get-key -> Frontend ko public key_id bhejne ke liye
router.get('/get-key', getRazorpayKey);

// POST /api/payment/create-order -> Naya order create karne ke liye
router.post('/create-order', createOrder);

// POST /api/payment/verify -> Payment signature verify karne ke liye
router.post('/verify', verifyPayment);

// GET /api/payment/all -> Saare transactions ki list dekhne ke liye
router.get('/all', getAllPayments);

export default router;
```

---

## 8. `server.js`

```javascript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Config & Routes imports
import connectDB from './config/db.js';
import paymentRoutes from './routes/payment.routes.js';

// Resolve directory paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Connect to Database
connectDB();

// 3. Payment Routes
app.use('/api/payment', paymentRoutes);

// 4. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Razorpay Server ready at: http://localhost:${PORT}`);
});
```

---

## 9. `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Razorpay Payment Gateway Test - Sheryians / KODR</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 32px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      background: #0284c7;
      color: #fff;
      border-radius: 999px;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 8px;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .price-box {
      background: #0f172a;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .price-box .item {
      font-size: 15px;
      font-weight: 500;
    }
    .price-box .amount {
      font-size: 20px;
      font-weight: 700;
      color: #38bdf8;
    }
    .btn {
      width: 100%;
      padding: 14px;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    #status-box {
      margin-top: 20px;
      padding: 12px;
      border-radius: 6px;
      font-size: 13px;
      display: none;
      word-break: break-all;
    }
    .status-success {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid #22c55e;
      color: #4ade80;
    }
    .status-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #ef4444;
      color: #f87171;
    }
  </style>

  <!-- 1. Razorpay Checkout Script & Axios CDN -->
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>

  <div class="card">
    <span class="badge">Razorpay Test Mode</span>
    <h1>Backend Domination Course</h1>
    <p>Test the full flow: Order Creation &rarr; Razorpay Modal &rarr; Backend Signature Verification.</p>

    <div class="price-box">
      <span class="item">Course Enrollment Fee</span>
      <span class="amount">₹50.00</span>
    </div>

    <button id="rzp-button1" class="btn">Pay ₹50 with Razorpay</button>

    <div id="status-box"></div>
  </div>

  <script>
    const payBtn = document.getElementById('rzp-button1');
    const statusBox = document.getElementById('status-box');

    function showStatus(message, isError = false) {
      statusBox.style.display = 'block';
      statusBox.className = isError ? 'status-error' : 'status-success';
      statusBox.innerHTML = message;
    }

    payBtn.onclick = async function (e) {
      e.preventDefault();
      payBtn.disabled = true;
      payBtn.innerText = 'Order Ban raha hai...';
      statusBox.style.display = 'none';

      try {
        // Step 1: Backend se public key_id lo
        const keyResponse = await axios.get('/api/payment/get-key');
        const razorpayKey = keyResponse.data.key;

        // Step 2: Backend ko bolo Razorpay pe order banaye
        const orderResponse = await axios.post('/api/payment/create-order', {
          amount: 50 // Amount in Rupees
        });
        const order = orderResponse.data;

        payBtn.innerText = 'Opening Checkout...';

        // Step 3: Razorpay Popup Modal Config
        const options = {
          key: razorpayKey,
          amount: order.amount, // in paise
          currency: order.currency,
          name: "Sheryians / KODR",
          description: "Backend Course Fee",
          image: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
          order_id: order.id,
          handler: async function (response) {
            payBtn.innerText = 'Verifying Payment...';

            // Step 4: Payment ho gaya! Backend pe verification ke liye bhejo
            try {
              const verifyRes = await axios.post('/api/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });

              showStatus(`
                <strong>🎉 Payment Verified Successfully!</strong><br/>
                Payment ID: ${response.razorpay_payment_id}<br/>
                Order ID: ${response.razorpay_order_id}
              `, false);
            } catch (err) {
              showStatus(`Verification Failed: ${err.response?.data?.message || err.message}`, true);
            } finally {
              payBtn.disabled = false;
              payBtn.innerText = 'Pay ₹50 with Razorpay';
            }
          },
          prefill: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "9000090000"
          },
          theme: {
            color: "#2563eb"
          }
        };

        const rzp1 = new Razorpay(options);

        rzp1.on('payment.failed', function (response) {
          payBtn.disabled = false;
          payBtn.innerText = 'Pay ₹50 with Razorpay';
          showStatus(`
            <strong>❌ Payment Failed</strong><br/>
            Reason: ${response.error.description}<br/>
            Code: ${response.error.code}
          `, true);
        });

        rzp1.open();
      } catch (error) {
        payBtn.disabled = false;
        payBtn.innerText = 'Pay ₹50 with Razorpay';
        showStatus(`Error: ${error.response?.data?.message || error.message}`, true);
      }
    };
  </script>

</body>
</html>
```

---

## 10. React Integration Component (`PaymentButton.jsx`)

Agar aap ya aapke students React / Next.js / Vite me frontend bana rahe hain:

```jsx
import React from 'react';
import axios from 'axios';

export default function PaymentButton() {
  const handlePayment = async () => {
    try {
      // 1. Fetch public Key ID
      const { data: keyData } = await axios.get('http://localhost:5000/api/payment/get-key');

      // 2. Create Order on backend
      const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: 50, // Amount in Rupees
      });

      // 3. Configure Razorpay modal
      const options = {
        key: keyData.key,
        amount: order.amount, // paise
        currency: order.currency,
        name: 'Sheryians / KODR',
        description: 'Backend Course Enrollment',
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post('http://localhost:5000/api/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert('Payment Successful & Verified! 🎉');
          } catch (err) {
            alert('Verification Failed!');
          }
        },
        prefill: {
          name: 'Test Student',
          email: 'student@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: '12px 24px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      Pay with Razorpay
    </button>
  );
}
```

---

## 11. Test Mode Credentials Reference

- **UPI Test**:
  - Success: `success@razorpay`
  - Failure: `failure@razorpay`
- **Card Test**:
  - Number: `4111 1111 1111 1111`
  - Expiry: Any future date (e.g. `12/30`)
  - CVV: `123`
  - OTP: `123456`
