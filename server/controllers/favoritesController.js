// controllers/cartController.js
const User = require('../models/userModel');
const SECRET_KEY = process.env.JWT_SECRET;

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
  const { currentUser, productId } = req.params;

  try {
    // Update user's cart in the database
    await User.findByIdAndUpdate(
      currentUser,
      { $pull: { favorites: productId } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Product removed from favorites successfully', productId });
  } catch (error) {
    console.error('Error removing product from favorites:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { addToFavorites, deleteProductFromFavorites };


