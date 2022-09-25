const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {

    const from = Number(req.query.from) || 0;
    
    const [users, total] = await Promise.all([
        User
            .find({})
            .skip(from)
            .limit(5),
        User.countDocuments()
    ]);

    res.json({
        ok: true,
        users,
        total
    });
}

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Duplicated user'
            });
        }
        const user = new User(req.body);

        // Encrypt Password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // Save user
        await user.save();

        // Generate token
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
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

const updateUser = async (req, res = response) => {
    const uid = req.params.id;

    try {

        const userDB = await User.findById( uid );

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not exists'
            });
        }

        // Update data
        const { password, google, email, ...fields } = req.body;

        if (userDB.email !== email) {

            const emailExists = await User.findOne({ email });

            if (emailExists) {
                return res.status(400).json({
                    ok: false,
                    msg: 'User email already exists'
                });
            }
        }

        fields.email = email;

        const updatedUser = await User.findByIdAndUpdate(uid, fields, { new: true });

        res.json({
            ok: true,
            updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error'
        });
    }
}

const deleteUser = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById( uid );

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User not exists'
            });
        }

        await User.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'User Deleted'
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
    getUsers,
    createUser,
    updateUser,
    deleteUser
}