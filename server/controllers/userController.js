// controllers/userController.js
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, CNP, role } = req.body;
console.log(role);
    if (role == "patient") {
      // Check if the email is already taken
      const existingUser = await User.findOne({ CNP });
      if (existingUser) {
        return res.status(400).json({ message: "CNP is already registered." });
      }

      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        CNP,
        role,
        cart: [],
        orders: [],
      });
      await newUser.save();
      res.status(201).json({ message: "Patient registered successfully." });
    }
    else
    {
      // Check if the email is already taken
      const existingUser = await Doctor.findOne({ CNP });
      if (existingUser) {
        return res.status(400).json({ message: "CNP is already registered." });
      }

      // Create a new user
      const newUser = new Doctor({
        firstName,
        lastName,
        email,
        password,
        CNP,
        role,
        patients: [],
      });
      await newUser.save();
      res.status(201).json({ message: "Doctor registered successfully." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, CNP } = req.body;

    // Find the user by email
    const user = await User.findOne({ CNP });
    let role = " ";

    if (user) {
      role = user.role;
      console.log(`The role of the user with CNP ${CNP} is: ${role}`);
    } 

    // If the user doesn't exist or password is incorrect
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid CNP or password." });
    }

    // Create and send a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key");
    res.json({ token, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCartbyId = async (req, res) => {
  try {
    const { currentUser } = req.params;
    await User.findById(currentUser)
      .then((user) => {
        if (!user) {
          // User not found
          console.log("User not found");
          return;
        }

        // Access the cart field from the user document
        const cart = user.cart;
        res.json(cart);
      })
      .catch((error) => {
        console.error("Error retrieving user cart:", error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFavoritesbyId = async (req, res) => {
  try {
    const { currentUser } = req.params;
    await User.findById(currentUser)
      .then((user) => {
        if (!user) {
          // User not found
          console.log("User not found");
          return;
        }

        // Access the cart field from the user document
        const favorites = user.favorites;
        res.json(favorites);
      })
      .catch((error) => {
        console.error("Error retrieving user cart:", error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
