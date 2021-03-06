const express = require('express')
const passport = require('passport')
const router = express.Router()

//@desc Auth with Google
//@route   GET /auth/google
// Using google strategy created in passport.js file 
//scope of w.e is in the profile
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc Google auth callback
//@route   GET /auth/google/callback
//If fails redirect to route if passes redirect to dashboard
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    console.log(req.user)
    res.redirect('/dashboard')
})

//@desc Logout user
//@route   GET /auth/logout
router.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router