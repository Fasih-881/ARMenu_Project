import express from "express";

import {
  addmenu,
  getmenu,
  deletemenu,
  updatemenu,
} from "../controllers/menu.controllers.js";

const router = express.Router();

router.post("/add", addmenu);

router.get("/get", getmenu);

router.delete("/delete/:id", deletemenu);

router.put("/update/:id", updatemenu);

export default router;