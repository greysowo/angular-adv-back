const { response } = require("express")
const bcrypt = require('bcryptjs');

const { generateJWT } = require("../helpers/jwt");
const User = require('../models/user');

const login = async (req, res = response) => {
    const { email, password } = req.body;
    
    try {

        const userDB = await User.findOne( { email } );

        // Check Email
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email or Password not valid'
            });
        }

        // Check Password
        const validPassword = bcrypt.compareSync(password, userDB.password);

        if (!validPassword) {
            return res.json({
                ok: false,
                msg: 'Email or Password not valid'
            })
        }

        // Generate token
        const token = await generateJWT(userDB.id);
        
        res.json({
            ok: true,
            token
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
    login
}