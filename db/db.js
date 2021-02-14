const mongoose = require('mongoose')

const URI = "mongodb+srv://dan:danspassword@cluster0.yksbr.mongodb.net/users?retryWrites=true&w=majority"

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
})
