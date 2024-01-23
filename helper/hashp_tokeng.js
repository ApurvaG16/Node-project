const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")



const hashPassword= async(password)=>{
    const salt = await bcryptjs.genSalt(10)
    const hasP = await bcryptjs.hash(password,salt)
    return hasP;

}
const comparePassword = async(password,hashpassword)=>{
    const isMatch = await bcryptjs.compare(password,hashpassword);
    return isMatch
}

const generateToken = async(_id)=>{
    // eslint-disable-next-line no-undef
    const token = await jwt.sign({userId:_id},process.env.SECRET_TOKEN,{expiresIn:"1h"})
    return token
}


module.exports={hashPassword,comparePassword,generateToken}