import express from "express";

import {
  addmenu,
  getmenu,
} from "../controllers/menu.controllers.js";

const router = express.Router();

router.post("/add", addmenu);

router.get("/get", getmenu);

export default router;