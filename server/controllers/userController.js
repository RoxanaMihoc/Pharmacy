// controllers/userController.js
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Pharmacist = require("../models/pharmacistModel");
const jwt = require("jsonwebtoken");

function validateIdentifier(identifier, role) {
  let isValid = false;

  switch (role) {
    case "Patient":
      // Validate identifier: Starts with 5 or 6, followed by YYMMDD (valid date), and the rest are digits
      if (/^[56]\d{12}$/.test(identifier)) {
        const yearPrefix =
          parseInt(identifier.substring(0, 1), 10) === 5 ? 20 : 19;
        const year = yearPrefix + parseInt(identifier.substring(1, 3), 10);
        const month = parseInt(identifier.substring(3, 5), 10);
        const day = parseInt(identifier.substring(5, 7), 10);

        const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
        const date = new Date(dateStr);
        if (
          date.getFullYear() === year &&
          date.getMonth() + 1 === month &&
          date.getDate() === day
        ) {
          isValid = true;
        }
      }
      break;

    case "Doctor":
      // Validate DI: Starts with "DI" followed by digits
      isValid = /^DI\d+$/.test(identifier);
      break;

    case "Pharmacist":
      // Validate FI: Starts with "FI" followed by digits
      isValid = /^FI\d+$/.test(identifier);
      break;

    default:
      isValid = false;
      break;
  }

  return isValid;
}

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, identifier, role } = req.body;
    console.log("In register", req.body);

    if (role == "Patient") {
      const { selectedDoctor, birthDate, gender, height, weight,
        maritalStatus, phoneNumber, address, postalCode, medicationList, city } = req.body;
      let postal_code = postalCode;
      let birth_date = birthDate;
      let phone = phoneNumber;
      let doctor = selectedDoctor;
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
        role,
        cart: [],
        favorites: [],
        doctor,
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
      res.status(201).json({ message: "Patient registered successfully." });
    } else if (role == "Doctor") {
      // Check if the email is already taken
      const existingUser = await Doctor.findOne({ identifier });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Doctor is already registered." });
      }

      // Create a new user
      const newUser = new Doctor({
        firstName,
        lastName,
        email,
        password,
        identifier,
        role,
        patients: [],
      });
      await newUser.save();
      res.status(201).json({ message: "Doctor registered successfully." });
    } else {
      console.log(identifier);
      const existingUser = await Pharmacist.findOne({ identifier });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Pharmacist is already registered." });
      }

      // Create a new user
      const newUser = new Pharmacist({
        firstName,
        lastName,
        email,
        password,
        identifier,
        role,
        patients: [],
      });
      await newUser.save();
      res.status(201).json({ message: "Pharmacist registered successfully." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, identifier } = req.body;

    // Find the user by email
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
        .json({ message: "Invalid identifier or password." });
    }

    // Create and send a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      "your-secret-key"
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