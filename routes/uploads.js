/*
    Route: /api/uploads
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validateJWT } = require('../middlewares/jwt-validator');
const { fileUpload, getImage } = require('../controllers/upload');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, fileUpload);

router.get('/:type/:img', getImage);


module.exports = router;