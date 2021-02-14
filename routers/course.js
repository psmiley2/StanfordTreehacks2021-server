const express = require('express')
const {Course} = require('../models/Course')
const auth = require('../middleware/auth')
const User = require("../models/User")
const router = express.Router()

router.post('/courses', auth, async (req, res) => {
    try {
        const course = new Course(req.body)
        await course.save()
        res.status(201).send({ course })
    } catch (error) {
        res.status(400).send(error)
    }
})

// Get a course by id
router.get("/courses/id/:id", auth, async (req, res) => {
    try {
        let {id} = req.params; 
        let course = {}

        await Course.findById(id)
        .then((c) => {
            if (c) {
                course = c
            } else {
                res.status(400).send("no course found for given id")
            }
        }).catch((err) => {
            console.error(err)
        })
        res.status(200).send(course)
    } catch (error) {
       res.status(400).send(error) 
    }
})


// Get a course by id
router.get("/courses/community/:id", auth, async (req, res) => {
    try {
        let {id} = req.params; 
        let courses = []

        await Course.find({topic: id})
        .then((cs) => {
            if (cs) {
                courses = cs
            } else {
                res.status(400).send("no courses found for given id")
            }
        }).catch((err) => {
            console.error(err)
        })
        res.status(200).send(courses)
    } catch (error) {
       res.status(400).send(error) 
    }
})

// Create a new lecture
router.post('/courses/id/:courseID/lecture', auth, async (req, res) => {
    try {
       let {courseID} = req.params;
       let lectureInfo = req.body;
       lectureInfo["author"] = req.user.email;
       let action = {
           $push: {"lectures": lectureInfo}
       }
       await Course.findByIdAndUpdate(courseID, action)
       .then((res) => {
           if (!res) {
               res.status(400).send("No course with the given ID")
           }
       }).catch((err) => {
           console.error(err)
       })
       res.status(201).send(lectureInfo)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Create a new thread
router.post('/courses/id/:courseID/thread', auth, async (req, res) => {
    try {
       let {courseID} = req.params;
       let threadInfo = req.body;
       threadInfo["author"] = req.user.email;
       let action = {
           $push: {"threads": threadInfo}
       }
       await Course.findByIdAndUpdate(courseID, action)
       .then((res) => {
           if (!res) {
               res.status(400).send("No course with the given ID")
           }
       }).catch((err) => {
           console.error(err)
       })
       res.status(201).send(threadInfo)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Upvote a lecture 
router.post('/courses/id/:courseID/lecture/:lectureID', auth, async (req, res) => {
    try {
       let {courseID, lectureID} = req.params;
       let action = {
           $inc: {"lectures.$[lecture].votes": 1}
       }
       let filter = {
           arrayFilters: [{"lecture._id": lectureID}]
       }
       await Course.findByIdAndUpdate(courseID, action, filter)
       .then((res) => {
           if (!res) {
               res.status(400).send("Could not find a match with the given IDs.")
           }
       }).catch((err) => {
           console.error(err)
       })
       res.status(201).send("success")
    } catch (error) {
        res.status(400).send(error)
    }
})

// Assign a user to a course
router.post("/courses/id/:id", auth, async (req, res) => {
    try {
        let courseID = req.params.id; 
        let userID = req.user._id
        let user = {}

        let action = {
            $push: {"courses": courseID}
        }

        await User.findByIdAndUpdate(userID, action)
        .then((u) => {
            if (u) {
                user = u
            } else {
                res.status(400).send("no course found for given id")
            }
        }).catch((err) => {
            console.error(err)
        })
        res.status(200).send(user)
    } catch (error) {
       res.status(400).send(error) 
    }
})

module.exports = router