const express = require('express');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create a user using :post "api/auth/createuser". no login required
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('username').isLength({ min: 5 }),
    body('password').isLength({ min: 7 })
], async (req, res) => {

    // if errors are present show the error message and return bad request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    //check whether user with same email and username existx
    try {


        let user = await User.findOne({ email: req.body.email, username: req.body.username })
        if (user) {
            return res.status(400).json({ error: "Sorry a user exist either with same email or username or both" })
        }

        user = await User.create({
            name: req.body.name,
            password: req.body.password,
            username: req.body.username,
            email: req.body.email
        })

        res.json({ user })
    } catch (error) {
        console.log(error.message)
        res.status(500).send("error occured")
    }

})

module.exports = router;        