const fs = require('fs');

const User = require('../models/user');
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');

const deleteImage = (previousPath) => {
    
    if (fs.existsSync(previousPath)) {
        // Delete previous image
        fs.unlinkSync(previousPath);
    }
}

const updateImage = async (type, id, filename) => {

    switch (type) {
        case 'doctors':
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                console.log('Not exists id');
                return false;
            }

            const doctorPath = `./uploads/doctors/${doctor.img}`;
            deleteImage(doctorPath);

            doctor.img = filename;
            await doctor.save();
            return true;
            break;
        case 'hospitals':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('Not exists id');
                return false;
            }

            const hospitalPath = `./uploads/hospitals/${hospital.img}`;
            deleteImage(hospitalPath);

            hospital.img = filename;
            await hospital.save();
            return true;
            break;
        case 'users':
            const user = await User.findById(id);
            if (!user) {
                console.log('Not exists id');
                return false;
            }

            const userPath = `./uploads/users/${user.img}`;
            deleteImage(userPath);

            user.img = filename;
            await user.save();
            return true;
            break;
        default:
            break;
    }

}

module.exports = {
    updateImage
}