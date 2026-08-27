
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: name,
            },

            unit_amount: Math.round(Number(price) * 100),
          },

          quantity: quantity || 1,
        },
      ],

      success_url:
        "http://192.168.18.238:5173/?payment=success",

      cancel_url:
        "http://192.168.18.238:5173/?payment=cancel",
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

