
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import connectDB from "../config/db.js";
import menuroute from "../routes/menu.routes.js";
import paymentroute from "../routes/payment.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

connectDB();

app.use("/", menuroute);

app.use("/", paymentroute);

app.get("/test", (req, res) => {
  res.send("Backend is working");
});

export default app;

