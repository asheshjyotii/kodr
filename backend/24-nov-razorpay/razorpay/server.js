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