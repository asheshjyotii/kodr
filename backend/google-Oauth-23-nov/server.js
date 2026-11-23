import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express"
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as GitHubStrategy } from "passport-github2"

import { signToken } from "./utils/jwt.js";


const app = express()

// config
const googleConfig = {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: process.env.GOOGLE_CALLBACK_URL
   };


   const linkdinConfig={

   }

// Initialize Passport (No express-session used; session: false)
app.use(passport.initialize());

//middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(
   new GoogleStrategy(
      googleConfig,
      (accessToken, refreshToken, profile, done) => {
         // In production: findOrCreate user in Database
         // For this 30-min demo: normalize the profile payload for JWT token
         const user = {
         provider: 'google',
         id: profile.id,
         name: profile.displayName || 'Google User',
         email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : 'No email',
         avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : 'https://via.placeholder.com/150'
         };
         return done(null, user);
      }
   )
   );

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    const user = {
         provider: 'github',
         id: profile.id,
         name: profile.displayName || 'github User',
         email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : 'No email',
         avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : 'https://via.placeholder.com/150'
         };
         return done(null, user);
  }
   ))





// add Routes
   app.get('/auth/google', passport.authenticate('google', {
      session: false,
      scope: ['profile', 'email'],
      prompt: 'select_account'
   })
   );


   app.get( '/auth/google/callback',passport.authenticate('google', { session: false }),
   (req, res) => {
      const token = signToken(req.user);

      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         maxAge: 24 * 60 * 60 * 1000
      });
      res.send(token);
   }
   );


app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login', session:false }),
  (req, res) => {
      const token = signToken(req.user);

      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         maxAge: 24 * 60 * 60 * 1000
      });
      res.send(token);
   });



app.listen(3000, ()=>{
    console.log("server is running...")
})