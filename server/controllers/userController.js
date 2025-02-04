// controllers/userController.js
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Pharmacist = require("../models/pharmacistModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "09b844471b9798b9e81ae3f67efb02c0196f51291d450fa53359d1e3f2bfa0b9a99b93210585a6d2fe3f79ec340f3c38e2ff4e1e48aabe20f1cd422732863663";

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, identifier } = req.body;
    console.log("In register", req.body);

    const {
      selectedDoctor,
      birthDate,
      gender,
      height,
      weight,
      maritalStatus,
      phoneNumber,
      address,
      postalCode,
      medicationList,
      city,
      doctorName,
    } = req.body;
    let postal_code = postalCode;
    let birth_date = birthDate;
    let phone = phoneNumber;
    let doctor = selectedDoctor;
    let doctorNameB = doctorName;
    // Check if the email is already taken
    const existingUser = await User.findOne({ identifier });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "identifier is already registered." });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      identifier,
      cart: [],
      favorites: [],
      doctor,
      doctorNameB,
      gender,
      phone,
      address,
      city,
      birth_date,
      postal_code,
      height,
      weight,
      maritalStatus,
      medicationList,
    });
    await newUser.save();
    console.log("lala", newUser._id, selectedDoctor);
    const patientId = newUser._id;
    const doctorId = selectedDoctor;
    const ret = await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { patients: patientId } }, // Use $addToSet to avoid adding duplicates
      { new: true, safe: true, upsert: false } // Options for the update operation
    );
    console.log(ret);

    await newUser.save();
    res.status(201).json({ message: "Pharmacist registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, identifier } = req.body;

    let user = await User.findOne({ identifier });
    let role = " ";

    if (!user) {
      console.log("Look for a doctor");
      user = await Doctor.findOne({ identifier });
    }

    if (!user) {
      console.log("Look for a pharmacist");
      user = await Pharmacist.findOne({ identifier });
    }

    if (user) {
      role = user.role;
      console.log(
        `The role of the user with identifier ${identifier} is: ${role}`
      );
    }
    console.log(user);
    // If the user doesn't exist or password is incorrect
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Parola invalida." });
    }
    console.log("in loginnn")

    // Create and send a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
       SECRET_KEY, { expiresIn: '24h' }
    );
    res.json({ token, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCartbyId = async (req, res) => {
  try {
    const { currentUser } = req.params;
    //currentUser null for some reason
    console.log("In cart", currentUser);
    let user = await User.findById(currentUser);
    if (!user) {
      // User not found
      console.log("User not found");
      return;
    }

    // Access the cart field from the user document
    const cart = user.cart;
    res.json(cart);
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

exports.getDetailsOfCurrentUser = async (req, res) => {
  try {
    const { currentUser } = req.params;
    //currentUser null for some reason
    console.log("In details about user", currentUser);
    let user = await User.findById(currentUser);
    if (!user) {
      // User not found
      console.log("User not found");
      return;
    }

    console.log(user);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
