const express = require('express');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const router = express.Router();


router.post('/', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('username').isLength({ min:5 }),
    body('password').isLength({ min: 7 })
], (req, res) => {
   
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({errors: result.array()});
    }
    User.create({
        name : req.body.name,
        password : req.body.password,
        username : req.body.username,
        email : req.body.email
    }).then(User=>res.json(User))
    .catch(err=>{console.log(err) 
        res.json({error:"please check if email and username both have unque value", message:err.message })}) 
 
}) 

module.exports = router;       