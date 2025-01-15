const Prescription = require("../models/prescriptionModel");
const { prescriptionDB } = require("../config/database");
const { ObjectId } = require("mongodb"); // Import ObjectId from MongoDB

exports.addPrescription = async (req, res, io, userSockets) => {
  const { diagnosis, doctorId, patient, products, investigations } = req.body;
  console.log("Prescriptie::::::", products);

  const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const prescriptionNumber = generateRandomNumber();

  try {
    const newPrescription = new Prescription({
      doctorId,
      patient,
      diagnosis,
      products,
      investigations,
      prescriptionNumber,
    });

    const patientCollectionName = `patient_${patient._id}`;
    const patientCollection = prescriptionDB.collection(patientCollectionName);
    await patientCollection.insertOne({
      prescriptionId: newPrescription._id,
      ...newPrescription.toObject(),
    });

    // Create or update the doctor collection
    const doctorCollectionName = `doctor_${doctorId}`;
    const doctorCollection = prescriptionDB.collection(doctorCollectionName);
    await doctorCollection.insertOne({
      prescriptionId: newPrescription._id,
      ...newPrescription.toObject(),
    });

    console.log(typeof patient._id);
    console.log(userSockets[patient._id]);
    let date = newPrescription.date;
    console.log(date);

    // Emit an event to the specific patient's socket ID if they are connected
    io.to(userSockets[patient._id].socketId).emit("new-prescription", {
      id: newPrescription._id,
      message: "Ai primit o rețetă medicală de la doctor.",
      prescriptionDetails: {
        doctorId,
        patient,
        diagnosis,
        products,
        investigations,
        date,
      },
      prescriptionNumber,
    });
    console.log("peste io");

    res.status(201).json({
      message: "Prescription created successfully",
      data: newPrescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ error: "Internal server was errored" });
  }
};

exports.getAllPrescriptionsBasedOnRole = async (req, res) => {
  try {
    const { currentUser } = req.params;
    console.log("currentUser:", currentUser);

    let collectionName = `doctor_${currentUser}`;
    let collection = prescriptionDB.collection(collectionName);

    let prescriptions = await collection.find({}).toArray();
    console.log("Doctor Prescriptions:", prescriptions);

    // If no prescriptions found in doctor_{user}, try patient_{user}
    if (prescriptions.length === 0) {
      collectionName = `patient_${currentUser}`;
      collection = prescriptionDB.collection(collectionName);
      prescriptions = await collection.find({}).toArray();
      console.log("Patient Prescriptions:", prescriptions);
    }

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPrescriptionsByPatientId = async (req, res) => {
  try {
    const { user } = req.params;
    console.log("lol", user);
    let collectionName = `patient_${user}`;
    console.log(user);
    let collection = prescriptionDB.collection(collectionName);
    let prescriptions = await collection.find({}).toArray();
    console.log("Patient Prescriptions:", prescriptions);
    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.setPrescriptionsAsCurrent = async (req, res) => {
  const { prescriptionId } = req.params;
  const { currentUser } = req.body;

  console.log("IN SET", prescriptionId, currentUser);

  try {
    // Connect to the dynamic collection
    const collectionName = `patient_${currentUser}`;
    const collection = prescriptionDB.collection(collectionName);

    // Convert prescriptionId to ObjectId (if required)
    const objectId = new ObjectId(prescriptionId);

    // Update the document
    const result = await collection.updateOne(
      { _id: objectId }, // Filter by _id
      { $set: { currentPrescription: true } } // Update currentPrescription field
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Prescription not found." });
    }

    res.status(200).json({ message: "Prescription marked as current." });
  } catch (error) {
    console.error("Error setting prescription as current:", error);
    res.status(500).json({ error: "Failed to mark prescription as current." });
  }
};

exports.setPrescriptionsAsNotCurrent = async (req, res) => {
  const { prescriptionId } = req.params;
  const { currentUser } = req.body;

  console.log("IN DELETE", prescriptionId, currentUser);

  try {
    // Connect to the dynamic collection
    const collectionName = `patient_${currentUser}`;
    const collection = prescriptionDB.collection(collectionName);

    // Convert prescriptionId to ObjectId (if required)
    const objectId = new ObjectId(prescriptionId);

    // Update the document
    const result = await collection.updateOne(
      { _id: objectId }, // Filter by _id
      { $set: { currentPrescription: false } } // Update currentPrescription field
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Prescription not found." });
    }

    res.status(200).json({ message: "Prescription removed as current." });
  } catch (error) {
    console.error("Error removing prescription as current:", error);
    res
      .status(500)
      .json({ error: "Failed to remove prescription as current." });
  }
};

exports.getCurentPrescription = async (req, res) => {
  try {
    const { currentUser } = req.params;
    console.log("lol - current pres", currentUser);
    let collectionName = `patient_${currentUser}`;
    let collection = prescriptionDB.collection(collectionName);
    let prescription = await collection
      .find({ currentPrescription: true })
      .toArray();
    console.log("Patient Current Prescription:", prescription);
    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { medIndex, progressHistory, currentUser} = req.body;
    const { prescriptionId } = req.params;

    console.log(
      "Updating progress",
      medIndex,
      progressHistory,
      currentUser,
      prescriptionId,
    );

    let collectionName = `patient_${currentUser}`;
    let collection = prescriptionDB.collection(collectionName);

    // Find the prescription by ID
    const prescription = await collection.findOne({
      _id: new ObjectId(prescriptionId),
    });

    if (!prescription) {
      return res.status(404).send({ message: "Prescription not found" });
    }

    // Check if progressHistory exists for the specified product
    const product = prescription.products[medIndex];
    if (!product) {
      return res
        .status(404)
        .send({ message: "Medication not found in prescription" });
    }

    // Ensure progressHistory exists
    if (!Array.isArray(product.progressHistory)) {
      product.progressHistory = [];
    }

    // Current date in DD-MM-YYYY format
    const today = new Date().toLocaleDateString("en-GB"); // Format date as DD-MM-YYYY
    const currentTime = new Date().toLocaleTimeString(); // Current time in local format

    // Find existing entry for today's date
    const existingEntryIndex = product.progressHistory.findIndex(
      (entry) => entry.date === today
    );

    if (existingEntryIndex !== -1) {
      // If entry exists, update the dosesTaken and add the current time to timeTaken
      product.progressHistory[existingEntryIndex].dosesTaken +=
        progressHistory[0].dosesTaken;
      if (
        !Array.isArray(product.progressHistory[existingEntryIndex].timeTaken)
      ) {
        product.progressHistory[existingEntryIndex].timeTaken = [];
      }
      product.progressHistory[existingEntryIndex].timeTaken.push(currentTime);
    } else {
      // If entry does not exist, add a new one with the time
      product.progressHistory.push({
        date: today,
        dosesTaken: progressHistory[0].dosesTaken,
        timeTaken: [currentTime],
      });
    }
    console.log(progressHistory[medIndex])
    // Update the databas

      const updateResult = await collection.updateOne(
        { _id: new ObjectId(prescriptionId) },
        {
          $set: {
            [`products.${medIndex}.progressHistory`]: product.progressHistory, // Update the progressHistory
          },
        }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).send({ message: "Prescription not found" });
      }
  
      if (updateResult.modifiedCount === 0) {
        return res.status(400).send({ message: "Progress update failed" });
      }
  
      res.status(200).send({ message: "Progress history updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
