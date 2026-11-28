export const buildFailureResponse=( res, message, statusCode)=>{
  
    return res.status(statusCode).json({
    success: false,
    message,
  })
}