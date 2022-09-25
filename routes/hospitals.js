/*
    Route: /api/hospitals
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');

const { validateJWT } = require('../middlewares/jwt-validator');

const {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
} = require('../controllers/hospitals');

const router = Router();

router.get('/', getHospitals);

router.post('/',
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        validateFields
    ],
    createHospital
);

router.put('/:id',
    [
        
    ],
    updateHospital
);

router.delete('/:id',
    deleteHospital
);

module.exports = router;
