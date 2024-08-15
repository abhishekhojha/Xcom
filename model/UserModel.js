const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const SecretToken = process.env.JWT_SECRET_TOKEN;
const saltRounds = 10
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is invalid")
            }
        }
    },
    admin: {
        type: Boolean,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate: {
            validator(value) {
                return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(value);
            },
            message: 'Password must be at least 7 characters long and include letters, numbers, and at least one special character'
        }
    }
},
    { timestamps: true })
userSchema.pre("save", function (next) {
    const user = this
    if (!user.isModified("password")) return next()
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
    })
})
userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}
userSchema.methods.generateToken = function () {
    const token = jwt.sign({ "id": this._id }, SecretToken, { expiresIn: 86400 });
    return token;
}
module.exports = mongoose.model("User", userSchema)