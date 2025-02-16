// controllers/userController.js
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
  
const isIdentifierValid = (identifier, role) => {
  if(role =="Patient")
  {
    return /^\d{13}$/.test(identifier);
  }
  else
  {
    return /^DI\d{6}$/.test(identifier);
  }
};

// const isPasswordValid = (password) =>{
//   return !/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(password);
// }
exports.register = async (req, res) => {
  try {
    const {firstName, lastName, email, password, identifier,selectedDoctor, 
           birthDate,gender,height,weight,phoneNumber, address,
            postalCode, medicationList, city, doctorName,} = req.body;
    let postal_code = postalCode;
    let birth_date = birthDate;
    let phone = phoneNumber;
    let doctor = selectedDoctor;
    let doctorNameB = doctorName;
    let role = "Patient";

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!isIdentifierValid(identifier,role)) {
      return res.status(400).json({ message: "Invalid identifier for User." });
    }

    // if (!isPasswordValid(password)) {
    //   console.log(password);
    //   return res.status(400).json({ message: "Invalid password." });
    // }

    const existingUser = await User.findOne({ identifier });
    if (existingUser) {
      return res.status(409).json({ message: "User is already registered." });
    }

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
      medicationList,
      role,
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
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, identifier, role } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // if (!isIdentifierValid(identifier,role)) {
    //   return res.status(400).json({ message: "Invalid identifier for User." });
    // }

    // if (!isPasswordValid(password)) {
    //   return res.status(400).json({ message: "Invalid password." });
    // }
 
    let user = "";
    if(role == "Patient")
    {
      user = await User.findOne({ identifier });
    }
    else
    {
      user = await Doctor.findOne({ identifier });
    }
    console.log(user);

    if(!user)
    {
      return res.status(401).json({ message: "Incorrect identifier." });
    }

    if (email != user.email)
    {
      return res.status(401).json({ message: "Incorrect email." });
    }

    console.log(user);

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect Password." });
    }
    console.log("before jwt");
    const token = jwt.sign(
      {
        userId: user._id,
        role: role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({ token, role });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Error" });
  }
};


exports.getCartbyId = async (req, res) => {
  try {
    const currentUser = req.currentUser;
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
    res.status(500).json({ error: "Internal Error" });
  }
};

exports.getFavoritesbyId = async (req, res) => {
  try {
    const currentUser = req.currentUser;
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
    res.status(500).json({ error: "Internal Error" });
  }
};

exports.getDetailsOfCurrentUser = async (req, res) => {
  try {
    const currentUser = req.currentUser;
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
    res.status(500).json({ error: "Internal Error" });
  }
};
