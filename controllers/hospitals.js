const { response } = require("express");

const Hospital = require('../models/hospital');

const getHospitals = async (req, res = response) => {

    const hospitals = await Hospital.find()
                                    .populate('user', 'name img');

    res.json({
        ok: true,
        hospitals
    });

}

const createHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        user: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Error'
        });
    }
}

const updateHospital = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            });  
        }

        const changes = {
            ...req.body,
            user: uid
        }

        const hospitalUpdated = await Hospital.findByIdAndUpdate(id, changes, { new: true });

        res.json({
            ok: true,
            hospital: hospitalUpdated
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error'
        });   
    }
}

const deleteHospital = async (req, res = response) => {

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            });  
        }

        await Hospital.findOneAndDelete(id);

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
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
};