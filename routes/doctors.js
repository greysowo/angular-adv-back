/*
    Route: /api/doctors
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');

const { validateJWT } = require('../middlewares/jwt-validator');

const {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctors');

const router = Router();

router.get('/', getDoctors);

router.post('/',
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('hospital', 'Hospital id is invalid').isMongoId(),
        validateFields
    ],
    createDoctor
);

router.put('/:id',
    [
        
    ],
    updateDoctor
);

router.delete('/:id',
    deleteDoctor
);

module.exports = router;
