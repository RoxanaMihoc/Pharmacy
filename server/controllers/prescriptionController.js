const Prescription = require('../models/prescriptionModel');
const { prescriptionDB } = require("../config/database");

exports.addPrescription = async (req, res, io, userSockets) => {
    const { diagnosis, doctorId, patient, products, advice, investigations } = req.body;
    console.log("asa da",patient, products, advice);

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
            advice,
            prescriptionNumber
        });

    const patientCollectionName = `patient_${patient._id}`;
    const patientCollection = prescriptionDB.collection(patientCollectionName);
    await patientCollection.insertOne({ prescriptionId: newPrescription._id, ...newPrescription.toObject() });

    // Create or update the doctor collection
    const doctorCollectionName = `doctor_${doctorId}`;
    const doctorCollection = prescriptionDB.collection(doctorCollectionName);
    await doctorCollection.insertOne({ prescriptionId: newPrescription._id, ...newPrescription.toObject() });


        console.log(typeof(patient._id));
        console.log(userSockets[patient._id]);
        let date = newPrescription.date;
        console.log(date);

        // Emit an event to the specific patient's socket ID if they are connected
        io.to(userSockets[patient._id].socketId).emit('new-prescription', {
            id: newPrescription._id,
            message: 'Ai primit o rețetă medicală de la doctor.',
            prescriptionDetails: {
                doctorId,
                patient,
                diagnosis,
                products,
                investigations,
                advice,
                date,
            },
            diagnosis,
            investigations,
            advice,
        });
        console.log("peste io");

        res.status(201).json({ message: 'Prescription created successfully', data: newPrescription });
    } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({ error: 'Internal server was errored' });
    }
};

exports.getAllPrescriptions= async (req, res) =>{
    try {
    const pres = await Prescription.find({});
    res.json(pres);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getPrescriptionsByPatientId = async (req, res) => {
    try {
      const { user} = req.params;
      console.log(user);
      query = { patientId: user };
      const prescription = await Prescription.find(query);
      console.log("skdcn",prescription);
      res.json(prescription);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

