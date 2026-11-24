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