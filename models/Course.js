const mongoose = require('mongoose')

const lectureSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    votes: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    }
})

const Lecture = mongoose.model('Lecture', lectureSchema)

const threadSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
})

const Thread = mongoose.model('Thread', threadSchema)

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true
    },
    lectures: {
        type: [lectureSchema],
        default: []
    },
    threads: {
        type: [threadSchema],
        default: []
    }
})
const Course = mongoose.model('Course', courseSchema)

module.exports = { Course, Lecture , Thread} 