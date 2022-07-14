const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const mongoose = require('mongoose')


/*-------------------------------------------------VALIDATION FUNCTION -------------------------------------------------*/
// validate email address 
const isValidEmail = (email) => {
    let regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regEx.test(email)
}

// validate phone number 
const isValidMobile = (number) => {
    let regEx = /^(\+\d{1,3}[- ]?)?\d{10}$/
    return regEx.test(number)
}

//validate name for upper case abbrivated name
const upar_case = function(fun){
    return  fun.toUpperCase()
}

const lower_case = function(fun){
    return  fun.toLowerCase()
}


/*------------------------------------CREATE INTERN ------------------------------------------------*/

const createIntern = async function (req, res){
    try {
        const data = req.body

        let {
            name,
            email,
            mobile,
            collegeName
        } = data


        let obj = {}

        obj.name = data.name.trim().split(" ").filter(word=>word).join(" ")
        obj.email = data.email.trim()
        obj.mobile = data.mobile.trim()
        obj.collegeName = data.collegeName.trim().split(" ").filter(word=>word).join(" ")

        // check data is exist | key exist in data
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Post body data must be required!" })
        }


        // validate it's values
        if (!name) {
            return res.status(400).send({ status: false, msg: "Intern's name is missing" })
        }

        if (!/^([a-zA-Z. ]){1,100}$/.test(name)) {
            return res.status(400).send({ status: false, msg: "name should contain only alphabetic chacraters" })
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "Intern's email is missing" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "enter valid email address" })
        }
        if (!mobile ) {
            return res.status(400).send({ status: false, msg: "Intern's mobile number is missing" })
        }
        if (!isValidMobile(mobile)) {
            return res.status(400).send({ status: false, msg: "mobile number is not valid" })
        }
        if (!collegeName) {
            return res.status(400).send({ status: false, msg: "Intern's college name is missing" })
        }
        email = lower_case(email)
        collegeName = upar_case(collegeName)


        // check if college id is exist in our collection OR not
        const inCollegeDb = await collegeModel.findOne({
            name: collegeName,
            isDeleted: false
        })

        
        if (!inCollegeDb) {
            return res.status(400).send({ status: false, msg: "the college where you belong doesn't exist" })
        }


        // check if email address is exist in our collection OR not 
        let duplicateEmail = await internModel.findOne({ email: email })
        if (duplicateEmail) {
            return res.status(409).send({ status: false, msg: "Email already exists" })
        }


        // check if phone number is exist in our collection OR not
        let duplicateMobile = await internModel.findOne({mobile:mobile})
        if(duplicateMobile){
            return res.status(409).send({status: false, msg: "Mobile already exists"})
        }


        let insertData = {
            name,
            email,
            mobile,
            collegeId: inCollegeDb._id,
        }

        res.setHeader('Access-Control-Allow-Origin','*')

        // now - create a document in the collection
        const create = await internModel.create(obj)
        return res.status(201).send({ status: true, data: create})
    }


    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}



module.exports.createIntern = createIntern



