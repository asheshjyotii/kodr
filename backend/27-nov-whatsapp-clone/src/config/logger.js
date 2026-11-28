import pino from "pino";
import env from "./env.js"

// internally uses "Stream"
// aSync Nature: Non Blocking
export default pino({
  level: env.LOGGER_LEVEL,
  transport: {
    target: "pino-pretty",
  }
})