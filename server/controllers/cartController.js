// controllers/cartController.js
const User = require("../models/userModel");
const SECRET_KEY = process.env.JWT_SECRET;

const addToCart = async (req, res) => {
  console.log("in addto cart backend");
  const { productId, prescriptionId } = req.body;
  const userId = req.currentUser;
  console.log("Pres", prescriptionId);
  

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          cart: {
            productId: productId,
            prescriptionId: prescriptionId,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or no matching product in cart.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      productId,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
};

const deleteProductFromCart = async (req, res) => {
  const { productId } = req.params;
  const currentUser = req.currentUser;
  console.log("IN DELETE CART", currentUser, productId);
  

  try {
    // Update user's cart in the database
    const updatedUser = await User.findByIdAndUpdate(
      currentUser,
      {
        $pull: {
          cart: { productId: productId }, // Match the object where productId matches
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or no matching product in cart.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      updatedCart: updatedUser.cart, // Send back the updated cart if needed
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
};

const deleteCartFromUser = async (req, res) => {
  const currentUser = req.currentUser;
  console.log("in delete cart");
  
  try {
    // Update user's cart in the database
    const updatedUser = await User.findByIdAndUpdate(
      currentUser,
      { $set: { cart: [] } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart removed successfully when user placed an order",
    });
  } catch (error) {
    console.error("Error removing cart after the user placed an order:", error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
};

module.exports = { addToCart, deleteProductFromCart, deleteCartFromUser };
