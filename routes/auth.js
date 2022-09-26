/*
    Route: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
const { login, loginWithGoogle } = require('../controllers/auth');

const router = Router();

router.post('/',
    [
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        validateFields
    ],
    login
);

router.post('/google',
    [
        check('token', 'Token is required').not().isEmpty(),
        validateFields
    ],
    loginWithGoogle
);


module.exports = router;