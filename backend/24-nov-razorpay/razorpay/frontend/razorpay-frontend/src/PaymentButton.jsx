import React from 'react';
import axios from 'axios';

export default function PaymentButton() {
  const handlePayment = async () => {
    try {
      // 1. Fetch public Key ID
      const { data: keyData } = await axios.get('http://localhost:5001/api/payment/get-key');

      // 2. Create Order on backend
      const { data: order } = await axios.post('http://localhost:5001/api/payment/create-order', {
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
            await axios.post('http://localhost:5001/api/payment/verify', {
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