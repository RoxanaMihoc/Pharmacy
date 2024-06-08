const Doctor = require('../models/doctorModel');
const User = require("../models/userModel");

const getAllDoctors= async (req, res) =>{
    try {
        console.log("in doctors");
    const doctors = await Doctor.find({});
    res.json(doctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllPatientsByDoctorId= async (req, res) =>{
  const { currentUser } = req.params;
  console.log("lalain get all doct", currentUser);
  query ={ doctor: currentUser};

  try {
    const patients = await User.find( query);
    console.log(patients);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// for product/productId
const getPatientDetails = async (req, res) =>{
  const {patientId} = req.params;
  console.log("id",patientId);

  query ={ _id: patientId};

  try {
    const user = await User.find( query);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

module.exports ={ getAllDoctors, getAllPatientsByDoctorId, getPatientDetails };