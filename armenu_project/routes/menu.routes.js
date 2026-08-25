import mongoose from 'mongoose'
import express from 'express'
import { addmenu,getmenu } from '../controllers/menu.controllers.js'

const route = express.Router();

route.get('/add', addmenu);
route.get('/get', getmenu);

export default route;