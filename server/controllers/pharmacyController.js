// pharmacyController.js
const Pharmacy = require("../models/pharmacyModel");
const SECRET_KEY = process.env.JWT_SECRET;

const checkStock = async (req, res) => {
  try {
    const { productIds } = req.body;
    console.log(productIds);
    const pharmacies = await Pharmacy.find({
      inventory: {
        $all: productIds.map((item) => ({
          $elemMatch: { productId: item.productId },
        })),
      },
    });
    console.log(pharmacies);

    res.json(pharmacies);
  } catch (error) {
    console.error("Error finding pharmacies", error);
    res.status(500).send("Error checking pharmacy stock");
  }
};

const getStock = async (req, res) => {
  const { currentUser } = req.params;
  try {
    query = { _id: currentUser };
    const stock = await Pharmacy.findById(currentUser);
    res.json(stock.inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

const deleteProduct = async (req, res) => {
  const { currentUser, id } = req.params;
  console.log(id);
  try {
    const pharmacy = await Pharmacy.findById(currentUser);
    if (!pharmacy) throw new Error("Pharmacy not found");

    pharmacy.inventory = pharmacy.inventory.filter(
      (item) => item.productId.toString() !== id
    );
    await pharmacy.save();
    res
      .status(200)
      .json({ message: "Product removed from inventory successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error removing product from inventory",
        error: error.message,
      });
  }
};

const modifyQuantity = async (req, res) => {
  const { currentUser, id } = req.params;
  const { quantity } = req.body; 

  if (!quantity) {
    return res.status(400).json({ message: "Quantity is required" });
  }

  try {
    const pharmacy = await Pharmacy.findById(currentUser);
    if (!pharmacy) throw new Error("Pharmacy not found");

    const item = pharmacy.inventory.find(
      (item) => item.productId.toString() === id
    );
    if (!item) throw new Error("Product not found in inventory");

    // Update the quantity
    item.quantity = quantity;

    await pharmacy.save();
    res
      .status(200)
      .json({ message: "Inventory updated successfully", updatedPharmacy });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating inventory", error: error.message });
  }
};

const getPharmatist = async (req, res) => {
    const pharmacy = req.params;
    console.log("in pharmacist", pharmacy.pharmacy);
    try {
        const pharmacists = await Pharmacy.find(pharmacy.pharmacy);
        console.log("in pharma",pharmacists);
        if (pharmacists.pharmacistId.length === 0) {
            return res.status(404).json({ message: 'No pharmacists found for this pharmacy.' });
        }
        res.json(pharmacists);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
module.exports = {
  checkStock,
  getStock,
  deleteProduct,
  modifyQuantity,
  getPharmatist,
};
