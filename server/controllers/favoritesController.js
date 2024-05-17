// controllers/cartController.js
const User = require('../models/userModel');

const addToFavorites = async (req, res) => {
  console.log("in addto favorites backend");
  const { userId, productId } = req.body;
  console.log(userId, productId);

  try {
    // Update user's cart in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: productId } },
      { new: true }
    );

    console.log(updatedUser);
    

    res.status(200).json({ success: true, message: 'Product added to favorites successfully', productId });
  } catch (error) {
    console.error('Error adding product to favorites:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteProductFromFavorites = async (req, res) =>{
  console.log("in addto cart backend");
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
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { addToFavorites, deleteProductFromFavorites };


