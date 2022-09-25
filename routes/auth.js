/*
    Route: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
const { login } = require('../controllers/auth');

const router = Router();

router.post('/',
    [
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        validateFields
    ],
    login
);


module.exports = router;