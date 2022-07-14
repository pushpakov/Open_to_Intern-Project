const express = require('express')
const router = express.Router()  
const createCollege = require("../controllers/collegeController")
const createIntern = require('../controllers/internController')
const getCollegeList = require('../controllers/getController')




router.post("/functionup/colleges", createCollege.createCollege)

router.post("/functionup/interns", createIntern.createIntern)

router.get("/functionup/collegeDetails", getCollegeList.getCollegeDetails)

   

module.exports = router   
