const express =require('express')
const router = express.Router()

//Login/Landing page
// route   GET /
router.get('/', (req,res) => {
    res.send('Login')
})

//Dashboard page
// route   GET /dashboard
router.get('/dashboard', (req,res) => {
    res.send('Dashboard')
})

module.exports = router