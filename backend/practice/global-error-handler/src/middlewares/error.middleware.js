const errorMiddleware = (err, req, res, next)=>{
    const statusCode = err.statusCode

    res.status(statusCode).json({
        status:false,
        message:err.message
    })
}

module.exports = errorMiddleware