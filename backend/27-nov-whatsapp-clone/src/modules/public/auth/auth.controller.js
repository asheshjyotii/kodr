import { buildSuccessResponse } from "../../../shared/utils/buildSuccessResponse.js";
import AuthService from "./auth.service.js";

export default class AuthController {
    constructor() { 
        // has a relation
        this.authService = new AuthService();
    }

    async refreshAccessToken (req, res) {
        const { accessToken } = await this.authService.RefreshAccessToken(req.cookies.refreshToken);
        res.cookie("accessToken", accessToken, app_config().cookie.accessToken);
        buildSuccessResponse(res)
    }

    async getMe(req, res) {
        return buildSuccessResponse(res, "User Verified",  req.user);
    }

    async GoogleCallback () {
        const { accessToken, refreshToken } = await this.authService.CreateUser(req.user);
        res.cookie("refreshToken", refreshToken, app_config().cookie.refreshToken);

        res.cookie("accessToken", accessToken, app_config().cookie.accessToken);

        res.redirect(env.REDIRECT_URL);
    }
}