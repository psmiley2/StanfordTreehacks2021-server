const express = require("express");
// require("dotenv").config();
// const cors = require("cors");
// const mongoose = require("mongoose");
// mongoose.set("useFindAndModify", false);
// const passport = require("passport");
// const session = require("express-session");
// var MongoStore = require("connect-mongo")(session);
// const userRoutes = require("./routes/users");

// const User = require("./models/User");
let app = express();

// Passport Config
// require("./config/passport")(passport);

// Database
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// Express Body Parser
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Cors
// app.use(
//     cors({
//         origin: ["http://localhost:3000"],
//         credentials: true,
//     })
// );

// Express session
// app.use(
//     session({
//         secret: "secret", // TODO -  MAKE THIS A LEGIT AND HIDDEN SECRET
//         resave: true,
//         saveUninitialized: true,
//         cookie: { maxAge: 2 * 60 * 60 * 1000 },
//         store: new MongoStore({
//             mongooseConnection: mongoose.connection,
//             ttl: 2 * 24 * 60 * 60,
//         }),
//     })
// );

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/sudarshan", (req, res) => {
    res.status(200).send("hi sudarshan!!")
})
// app.use("/users", userRoutes);

// Server Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Listening on PORT: ${PORT}`));