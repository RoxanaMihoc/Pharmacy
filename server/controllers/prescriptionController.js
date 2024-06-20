const Prescription = require('../models/prescriptionModel');

exports.addPrescription = async (req, res, io, userSockets) => {
    const { diagnosis, doctorId, patient, products, notes } = req.body;
    console.log(patient, products);

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
            notes,
            prescriptionNumber
        });

        await newPrescription.save();

        console.log(userSockets[patient._id]);

        // Emit an event to the specific patient's socket ID if they are connected
        io.to(userSockets[patient._id]).emit('new-prescription', {
            id: newPrescription._id,
            message: 'A new prescription has been issued to you.',
            prescriptionDetails: {
                doctorId,
                patient,
                diagnosis,
                products,
                notes
            }
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

