import userModel from  "../model/user.model.js"

export default class UserRepo {
    // user create
    async create(data) {
       return await userModel.create(data);
    }

    // find userby
    async findByEmail(email) {
        return await userModel.findOne({ email }).lean();
    }

}