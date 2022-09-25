/*
    Route: /api/users
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/jwt-validator');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');

const router = Router();

router.get('/', validateJWT , getUsers);

router.post('/',
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        validateFields
    ],
    createUser
);

router.put('/:id',
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('role', 'Role is required').not().isEmpty(),
        validateFields
    ],
    updateUser
);

router.delete('/:id',
    validateJWT,
    deleteUser
);

module.exports = router;