const express =require('express')
const router = express.Router()
const { ensureAuth , ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')
//@desc Login/Landing page
//@route   GET /
router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login',
    })
})

//@desc Dashboard page
//@route   GET /dashboard
router.get('/dashboard', ensureAuth , async (req,res) => {
    try {
        // Find stories made by Current User
        //lean() returns data as js object intead of mongodb document
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name:req.user.firstName,
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

module.exports = router