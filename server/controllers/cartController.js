// controllers/cartController.js
const User = require("../models/userModel");

const addToCart = async (req, res) => {
  console.log("in addto cart backend");
  const { userId, productId, prescriptionId } = req.body;
  console.log("Pres",prescriptionId);

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

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      productId,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteProductFromCart = async (req, res) => {
  const { currentUser, productId } = req.params;

  try {
    // Update user's cart in the database
    await User.findByIdAndUpdate(
      currentUser,
      { $pull: { cart: productId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      productId,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteCartFromUser = async (req, res) => {
  const { currentUser } = req.params;
  console.log("in delete cart");

  try {
    // Update user's cart in the database
    await User.findByIdAndUpdate(
      currentUser,
      { $set: { cart: [] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cart removed successfully when user placed an order",
    });
  } catch (error) {
    console.error("Error removing cart after the user placed an order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { addToCart, deleteProductFromCart, deleteCartFromUser };
