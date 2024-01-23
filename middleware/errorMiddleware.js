const errorMiddleware = async(err,req,res,next)=>{
    err.statusCode= err.statusCode || 500
    err.message == err.message || "Something went wrong"
    return  res.status(err.statusCode).send({
        status: err.statusCode,
        message :err.message
    })
}

module.exports= errorMiddleware;