import Menu from "../model/menu.model.js";

export const addmenu = async (req, res) => {
  try {
    const { name, price, URLmodel } = req.body;

    const newmenu = await Menu.create({
      name,
      price,
      URLmodel,
    });

    return res.status(201).json({
      success: true,
      message: "Menu added successfully",
      newmenu,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getmenu = async (req, res) => {
  try {
    const fullmenu = await Menu.find();

    return res.status(200).json({
      success: true,
      fullmenu,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};