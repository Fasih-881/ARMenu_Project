import Menu from "../model/menu.model.js";

// =========================
// ADD MENU
// =========================

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


// =========================
// GET MENU
// =========================

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


// =========================
// UPDATE MENU
// =========================

export const updatemenu = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, price, category, URLmodel } = req.body;

    const updatedMenu = await Menu.findByIdAndUpdate(
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

    if (!updatedMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      updatedMenu,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// DELETE MENU
// =========================

export const deletemenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
      deletedMenu,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};