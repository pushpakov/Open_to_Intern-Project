const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')


const getCollegeDetails = async function (req, res) {

    try {

        // get college name from query params
        let collegeName = req.query.collegeName

        if (!collegeName || collegeName.trim() == "") {
            return res.status(400).send({ status: false, msg: "PLEASE PROVIDE COLLEGE NAME IN QUERY PARAM" })
        }
        
        collegeName = req.query.collegeName.toUpperCase()

        const output = {}   

        // find college data by using college name
        const collegeData = await collegeModel.findOne({ name: collegeName, isDeleted: false })

        if (!collegeData) {
            return res.status(404).send({ status: false, msg: `College name '${collegeName}' doesn't exist!` })
        }

        // get all interns[] related to this college _id
        const internsList = await internModel.find({ collegeId: collegeData._id, isDeleted: false }).select({
            name: 1,
            email: 1,
            mobile: 1
        })

        
        output.name = collegeData.name
        output.fullName = collegeData.fullName
        output.logoLink = collegeData.logoLink
        output.interns = internsList

        if (Object.keys(internsList).length == 0) {
            const msg = "NO INTERN APPLIED FOR THIS COLLEGE YET."
            internsList.push(msg)
            return res.status(200).send({ status: true,  data: output })
        }

        res.setHeader('Access-Control-Allow-Origin','*')

        return res.status(200).send({ status: true, data: output })

    }
    catch (err) {
        return res.status(500).send({ status: true, data: err.message })
    }
}




module.exports.getCollegeDetails = getCollegeDetails