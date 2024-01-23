const User = require("../models/userModels");
const { hashPassword, comparePassword, generateToken } = require("../helper/hashp_tokeng")
const ErrorHandler = require("../utils/errorHandler")


const registerController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }
        else {
            const findUser = await User.findOne({ email: email })
            if (findUser) return next(new ErrorHandler("user already exists", 409))
            const user = await new User({
                name,
                email,
                password: await hashPassword(password)
            })
            await user.save();
            return next(new ErrorHandler("Registration successfull", 201))
        }
    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Invalid credendtials", 400))
        }
        else {

            const user = await User.findOne({ email: email })
            if (!user) {
                return next(new ErrorHandler("Invalid credentials", 404))
            }
            const isMatch = await comparePassword(password, user.password)
            if (!isMatch) {
                return next(new ErrorHandler("Invalid Password", 404))
            }
            const token = await generateToken(user._id)


            return res.status(200).send({
                message: "Login successfull",
                token: token,
                _id: user._id
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error, 404))
    }
}

module.exports = { registerController, loginController }