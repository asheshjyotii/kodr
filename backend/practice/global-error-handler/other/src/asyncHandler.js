const asyncHandler = (controller)=>(req,res)=>{
    Promise.resolve(controller(req,res)).catch(next)

}

// asynchandler 2
// const asyncHandler2= (controller)=>async(req,res, next)=>{
//     try {
//         await controller(req,res)
//     } catch (error) {
//         return res.status(error.status || 500).json({
//             success:false,
//             message: error
//         })
        
//     }
    
// }

// const asyncHandler3 = (controller) =>async(req,res,next) =>{
//     Promise.resolve(controller(req,res)).catch(err=>next(err))
// }

module.exports = asyncHandler  