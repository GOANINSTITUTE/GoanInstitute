// netlify/functions/createOrder.js
const Razorpay = require("razorpay");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { amount, currency, receipt } = JSON.parse(event.body);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay credentials");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: parseInt(amount, 10) * 100, // convert to paise
      currency: currency || "INR",
      receipt: receipt || "receipt_" + Date.now(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return {
      statusCode: 200,
      body: JSON.stringify(order),
    };
  } catch (err) {
    console.error("Error in createOrder:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Failed to create order" }),
    };
  }
};
