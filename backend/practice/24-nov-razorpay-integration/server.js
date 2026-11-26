const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
const cors = require('cors')
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils')

const app = express()



const RazorPaySchema = new mongoose.Schema({
    orderid:{
        type: String,
        required: true,
        unique: true,
    },
    paymentId:{
        type: String,
        default: null,
    },
    signature:{
        type: String,
        default: null,
    },
    amount:{
        type: Number,
        required: true,
    },
    currency:{
        type: String,
        default: 'INR',
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    }
},
{timestamps: true}
)

const PaymentModel = mongoose.model('payments',RazorPaySchema)

const connectDB = async ()=>{
    try {
        const conn = await mongo.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.log('something went wrong....')
    }
}








//razorpay instance
const razorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})




//controllers

//get public key
const getRazorpayPublicKey = (res,req)=>{
    res.status(200).json({
        success:true,
        key: process.env.RAZORPAY_KEY_ID
    })
}

const createOrder = async (req,res)=>{
    const {amount} = req.body
    const courseAmout = amount

    // convert amount to paisse
    const options={
        amount: Number(courseAmout)*100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    }

    //register order into razorpay
    const order = await razorpayInstance.orders.create(options)

    //save the order into db as pending

    await PaymentModel.create({
        orderId:order.id,
        amount: courseAmout,
        currency: order.currency,
        status: 'pending'
    })

    // send response 
    res.status(200).json({
        order
    })
}

// verify payment

const verifyPayment = async(req,res)=>{
    const {razorpayOrderId, razorpayPaymentId, signature} = req.body

    const secret = process.env.RAZORPAY_KEY_SECRET

    if(!razorpayOrderId || !razorpayPaymentId || !signature){
        return res.status(400).json({
            success:false,
            message:'orderID, or something is missng'
        })
    }

    const isAuthentic = validatePaymentVerification({
        order_id:razorpayOrderId,
        payment_id:razorpayPaymentId
    },
signature,
secret)
if (isAuthentic){
    
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
}
else{
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
}




app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','POST']
}))



app.get('/get-key', getRazorpayKey);

// POST /api/payment/create-order -> Naya order create karne ke liye
app.post('/create-order', createOrder);

// POST /api/payment/verify -> Payment signature verify karne ke liye
app.post('/verify', verifyPayment);

// GET /api/payment/all -> Saare transactions ki list dekhne ke liye
app.get('/all', getAllPayments);


const startApp = async()=>{

    await connectDB()
    app.listen(process.env.PORT,
        ()=>{
            console.log('server started at:',process.env.PORT)
        }
    )

    
}

startApp()