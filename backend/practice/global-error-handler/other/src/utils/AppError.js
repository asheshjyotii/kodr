// class AppError extends Error{
//     constructor(message, statusCode){
//         super(message);

//         this.message = message;
//         this.statusCode = statusCode;
//     }
// }

// class Parent{
//     message = null;
//     constructor(message){
// x    }
// }

class AppError extends Error{

    constructor(message,statusCode){
        super(message)
        
        this.message = message;
        this.statusCode = statusCode
    }
    
    
    }





    
module.exports = AppError