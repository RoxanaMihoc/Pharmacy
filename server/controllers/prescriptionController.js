const Prescription = require('../models/prescriptionModel');

exports.addPrescription = async (req, res, io, userSockets) => {
    const { doctorId, patientId, products, notes } = req.body;
    console.log(patientId, products);

    try {
        const newPrescription = new Prescription({
            doctorId,
            patientId,
            products,
            notes
        });

        await newPrescription.save();

        console.log(userSockets[patientId]);

        // Emit an event to the specific patient's socket ID if they are connected
        io.to(userSockets[patientId]).emit('new-prescription', {
            id: newPrescription._id,
            message: 'A new prescription has been issued to you.',
            prescriptionDetails: {
                doctorId,
                patientId,
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

