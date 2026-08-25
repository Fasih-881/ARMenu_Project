
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;

    const line_items = products.map((product) => {
      return {
        price_data: {
          currency: "usd",

          product_data: {
            name: product.name,
          },

          unit_amount: product.price,
        },

        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: line_items,

       success_url: "http://localhost:5173/?payment=success",

  cancel_url: "http://localhost:5173/?payment=cancel",
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

