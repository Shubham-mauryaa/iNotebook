const express = require('express');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "I am $hubham"


// Route 1: Create a user using :post "api/auth/createuser". no login required
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
        const secpass = await bcrypt.hash(req.body.password, salt); //secure password

        //creating new user
        user = await User.create({
            name: req.body.name,
            password: secpass,
            username: req.body.username,
            email: req.body.email
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)

        res.json({ authtoken })
        // res.json({ user })
    } catch (error) {
        console.log(error.message)
        res.status(500).send("error occured")
    }

})



//Route 2 : authentication using : POST - api/auth/login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be empty or less than length of 7').isLength({ min: 7 }).exists()
], async (req, res) => {

    // if errors are present show the error message and return bad request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "wrong credentials" })
        }

        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(400).json({ error: "wrong credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error Ocurred !!")
    }
})


//Route 3 : get logged user details using : POST - api/auth/getuser

router.post('/getuser',fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error Ocurred !!")
    }
})
module.exports = router;         