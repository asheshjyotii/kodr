const asyncHandler = (controller) => 
// express gets this function
  (req, res, next) => {
  Promise.resolve(controller(req, res)).catch(next);
};
//
module.exports = asyncHandler;
