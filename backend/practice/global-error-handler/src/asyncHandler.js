// const asyncHandler = (controller)=>(req,res,next)=>{
//     Promise.resolve(controller(req,res)).catch(next)
// }

// module.exports

const asyncHandler = (controller)=>(req,res, next)=>{
    Promise.resolve(controller).catch(next)
}
 module.exports = asyncHandler