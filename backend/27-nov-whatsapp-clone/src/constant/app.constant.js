export default {
  PORT: 3000,
  MONGO_URL: "mongodb://localhost:27017",
  LOGGER_LEVEL : "info",
  NODE_ENV: "development",
  RATELIMIT_WINDOWMS: 15 * 60 * 1000,
  RATELIMIT: 1000
}

export const app_config = () => {
  return {
    jwt: {
      accessToken: { expiresIn: env.NODE_ENV === "production" ? "1H" : "15S" },
      refreshToken: { expiresIn: env.NODE_ENV === "production" ? "30D" : "1D" } 
    },
    cookie: {
      accessToken: {
        httpOnly: env.NODE_ENV === "production",
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: env.NODE_ENV === "production" ? 60 * 60 * 1000 : 15 * 1000
      }, 
      refreshToken: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: env.NODE_ENV === "production" ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000
      }
    }
  }
}