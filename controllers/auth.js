const { response, json } = require("express")
const bcrypt = require('bcryptjs');

const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
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

const loginWithGoogle = async (req, res = response) => {
    try {
        const { email, name, picture } = await googleVerify(req.body.token);    

        const userDB = await User.findOne({ email });
        let user;

        if (!userDB) {
            user = new User({
                name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            user = userDB;
            user.google = true;
        }

        await user.save();

        // Generate token
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            email, name, picture,
            token
        });
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error'
        });   
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    
    // Generate token
    const token = await generateJWT(uid);

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    login,
    loginWithGoogle,
    renewToken
}