const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');

const { updateImage } = require("../helpers/update-image");

const fileUpload = (req, res = response) => {

    const type = req.params.type;
    const id = req.params.id;

    const validTypes = ['doctors', 'hospitals', 'users'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'Invalid type, it must be (doctor, user, hospital)'
        });
    }

    // Validate file exists
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
        });
    }

    // Process image
    const file = req.files.image;

    const splitName = file.name.split('.');
    const extensionFile = splitName[splitName.length - 1];

    // Validate extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!validExtensions.includes(extensionFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'Invalid extension'
        });
    }

    // Generate filename
    const filename = `${ uuidv4()}.${extensionFile}`;

    // Path to save file
    const path = `./uploads/${type}/${filename}`;

    // Move image
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error'
            });
        }
        
        // Update image
        updateImage(type, id, filename);

        res.json({
            ok: true,
            filename
        })
    });
}

const getImage = (req, res = response) => {
    const { type, img } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${type}/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/not-found-image.jpeg`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    getImage
}