
import dotenv from "dotenv";

dotenv.config();


import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import menuroute from "./routes/menu.routes.js";
import paymentroute from "./routes/payment.routes.js";


const app = express();


app.use(cors());

app.use(express.json());


connectDB();


app.use("/", menuroute);

app.use("/", paymentroute);


app.get("/test", (req, res) => {

  res.send("Backend is working");

});


app.listen(3000, "0.0.0.0", () => {

  console.log("Server is running on port 3000");

});

