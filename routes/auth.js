const express = require('express');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = "I am $hubham"

// Create a user using :post "api/auth/createuser". no login required
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 7 })
], async (req, res) => {

    // if errors are present show the error message and return bad request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    //check whether user with same email and username exist
    try {
        let user = await User.findOne({ email: req.body.email, username: req.body.username })
        if (user) {
            return res.status(400).json({ error: "Sorry a user exist either with same email or username or both" })
        }

        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password,salt) ; //secure password

        //creating new user
        user = await User.create({
            name: req.body.name,
            password: secpass,
            username: req.body.username,
            email: req.body.email
        })

        const data = {
            user :{
                id:user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)
        
        res.json({authtoken})
        // res.json({ user })
    } catch (error) {
        console.log(error.message)
        res.status(500).send("error occured")
    }
 
})

module.exports = router;        