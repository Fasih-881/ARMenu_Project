import mongoose from 'mongoose';
import Menu from '../model/menu.model.js';


export const addmenu = async (req, res) => {
    const name = "Chicken Duck";
    const price = 1000;
    const isAvailable = true;
    const URLmodel = "../ARModels/chicken_duck.glb";
    const add = await Menu.create({
        name :name,
       price : price,
        isAvailable : isAvailable,
        URLmodel : URLmodel
    });

        return res.status(200).json({message: "Menu added successfully"});
    }

    export const getmenu = async (req,res) => {
        const fullmenu = await Menu.find();
        if(fullmenu){
            return res.status(200).json({
                success : true,
                message : "-------Full Menu-------",
                fullmenu
            });
            return res.status(400).json({
                success : false,
                message : "Menu not found"
            });
        }
    }