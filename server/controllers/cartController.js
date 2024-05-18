// controllers/cartController.js
const User = require('../models/userModel');

const addToCart = async (req, res) => {
  console.log("in addto cart backend");
  const { userId, productId } = req.body;
  console.log('User:', User);

  try {
    // Update user's cart in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { cart: productId } },
      { new: true }
    );
    

    res.status(200).json({ success: true, message: 'Product added to cart successfully', productId });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteProductFromCart = async (req, res) =>{
  const { currentUser, productId } = req.params;

  try {
    // Update user's cart in the database
    await User.findByIdAndUpdate(
      currentUser,
      { $pull: { cart: productId } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Product removed from cart successfully', productId });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { addToCart, deleteProductFromCart };


