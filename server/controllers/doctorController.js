const Doctor = require('../models/doctorModel');
const User = require("../models/userModel");
const SECRET_KEY = process.env.JWT_SECRET;

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

const getPatientDetails = async (req, res) =>{
  const {patientId} = req.params;
  console.log("id",patientId.patient);
  

  query ={ _id: patientId};

  try {
    const user = await User.find( query);
    console.log(user);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}


const getDoctorName = async (req, res) => {
  try {
    const { doctorId } = req.params;
    

    // Fetch the doctor by ID
    const doctor = await Doctor.findById(doctorId).select('firstName lastName');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Return the first name and last name
    res.status(200).json({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
    });
  } catch (error) {
    console.error('Error fetching doctor details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports ={ getAllDoctors, getAllPatientsByDoctorId, getPatientDetails, getDoctorName };