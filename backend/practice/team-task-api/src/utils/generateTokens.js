const jwt = require('jsonwebtoken')

const generateTokens = (id)=>{
    const accessToken = jwt.sign({userId:id},process.env.acessTokenKey,{expiresIn:"10s"})
    const refreshToken = jwt.sign({userId:id},process.env.refreshTokenKey, {expiresIn:"1m"})

    return {accessToken, refreshToken}
}

module.exports = generateTokens