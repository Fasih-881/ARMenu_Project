
import Menu from "../model/menu.model.js";

export const addmenu = async (req, res) => {
  try {
    const { name, price, category, URLmodel } = req.body;

    const newmenu = await Menu.create({
      name,
      price,
      category,
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

export const deletemenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedmenu = await Menu.findByIdAndDelete(id);

    if (!deletedmenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
      deletedmenu,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updatemenu = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, price, category, URLmodel } = req.body;

    const updatedmenu = await Menu.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category,
        URLmodel,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedmenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      updatedmenu,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};