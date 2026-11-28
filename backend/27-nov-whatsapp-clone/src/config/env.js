import "dotenv/config"
import z from "zod";
import appConstant from "../constant/app.constant.js";

// schema
const envSchema = z.object({
   PORT: z.coerce.number().default(appConstant.PORT),
   MONGO_URL: z.string().default(appConstant.MONGO_URL),
   NODE_ENV: z.string().default(appConstant.NODE_ENV),
   LOGGER_LEVEL: z.string().default(appConstant.LOGGER_LEVEL),
   RATELIMIT_WINDOWMS: z.coerce.number().default(appConstant.RATELIMIT_WINDOWMS),
   RATELIMIT: z.coerce.number().default(appConstant.RATELIMIT),
   CORS_ORIGIN: z.string(),
   GOOGLE_CLIENT_ID: z.string(),
   GOOGLE_CLIENT_SECRET: z.string(),
   GOOGLE_CALLBACK_URL: z.string(),
   REFRESH_TOKEN_SECRET: z.string(),
   ACCESS_TOKEN_SECRET: z.string(),
   REDIRECT_URL: z.string(),
})

// checking
const parsed = envSchema.safeParse(process.env);

if(!parsed.success) {
    const ErrArray = parsed.error.message
    console.log(ErrArray)
}

export default parsed.data;