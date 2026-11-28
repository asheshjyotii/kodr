import helmet from "helmet"
import cors from "cors"
import CookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import env from "../config/env.js"
import hpp from "hpp"
import compression from "compression";
import express from "express"

export default function securityMiddleware(app) {
   app.use(helmet());

    app.use(cors({
        origin: env.CORS_ORIGIN.split(",").map((origin)=>origin.trim()),
        credentials: true
    }))

    app.use(CookieParser())

    app.use(rateLimit({
        windowMs: env.RATELIMIT_WINDOWMS,
        limit: env.RATELIMIT,
        legacyHeaders : true,
        message: "too many request try again after few minutes"
    }));

    app.use(hpp());
    app.use(compression());
    app.use(express.json({ limit: "3mb" }));
    app.use(express.urlencoded({ extended:true, limit:"3mb" }));
}