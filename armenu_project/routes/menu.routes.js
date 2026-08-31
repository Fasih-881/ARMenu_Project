import express from "express";

import {
  addmenu,
  getmenu,
  updatemenu,
  deletemenu,
} from "../controllers/menu.controllers.js";

const router = express.Router();

router.post("/add", addmenu);

router.get("/get", getmenu);

router.put("/update/:id", updatemenu);

router.delete("/delete/:id", deletemenu);

export default router;