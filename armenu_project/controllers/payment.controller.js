
import dotenv from "dotenv";
import Stripe from "stripe";


dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {

  try {

    const {
      name,
      price,
      quantity,
    } = req.body;


    const session = await stripe.checkout.sessions.create({

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


      success_url: "http://192.168.18.238:5173/success",


      cancel_url: "http://192.168.18.238:5173/cancel",

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

