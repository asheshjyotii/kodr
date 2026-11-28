import UserRepo from "../../../repository/user.repository.js";
import UnAuthorize from "../../../shared/error/unAuthorize.error.js";
import env from "../../../config/env.js"
import jwt from "jsonwebtoken";
import { app_config } from "../../../constant/app.constant.js";
export default class AuthService {
    constructor() {
        this.userRepo = new UserRepo();
    }

    async RefreshAccessToken (refreshToken) {
       if(!refreshToken) throw new UnAuthorize("Refresh token expired");
        // some more check will be here including (blacklisting and checking user agent)
       const payload = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
       const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET);

       return { accessToken };
    }
    // google auth kaa user
    async CreateUser(user) {
        const isUserPresent = await this.userRepo.findByEmail(user.emails[0].value);
        let result = isUserPresent;
        if(!isUserPresent) {
            const _user = await this.userRepo.create({
                email: user.emails[0].value,
                picture: user.photos[0].value,
                name: user.displayName
            });
            result = _user;
        }

        const data = {
            _id: result._id,
            email: user.emails[0].value,
            picture: user.photos[0].value,
            role: result.role,
            name: user.displayName 
        }

        const refreshToken = jwt.sign(data, env.REFRESH_TOKEN_SECRET, app_config().jwt.refreshToken);

        const accessToken = jwt.sign(data, env.ACCESS_TOKEN_SECRET, app_config().jwt.accessToken);

        return { accessToken, refreshToken };
    }   


}