const { response } = require("express");

const Doctor = require('../models/doctor');

const getDoctors = async (req, res = response) => {

    const doctors = await Doctor.find()
                                .populate('user', 'name img')
                                .populate('hospital', 'name img');

    res.json({
        ok: true,
        doctors
    });

}

const createDoctor = async (req, res = response) => {

    const uid = req.uid;
    const doctor = new Doctor({
        user: uid,
        ...req.body
    });

    try {

        const doctorDB = await doctor.save();

        res.json({
            ok: true,
            doctor: doctorDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Error'
        });
    }
    
}

const updateDoctor = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                ok: false,
                msg: 'Doctor not found'
            });  
        }

        const changes = {
            ...req.body,
            user: uid
        }

        const doctorUpdated = await Doctor.findByIdAndUpdate(id, changes, { new: true });

        res.json({
            ok: true,
            doctor: doctorUpdated
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error'
        });   
    }
    
}

const deleteDoctor = async (req, res = response) => {

    const id = req.params.id;

    try {

        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                ok: false,
                msg: 'Doctor not found'
            });  
        }

        await Doctor.findByIdAndRemove(id);

        res.json({
            ok: true,
            msg: 'Deleted'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error'
        });   
    }
    
}

module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
};