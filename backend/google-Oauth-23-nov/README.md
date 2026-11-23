# OAuth 2.0 (Google & Discord) with Passport.js & JWT

---
## 1. Getting OAuth Credentials

### Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/) &rarr; Create/select a project.
2. **APIs & Services** &rarr; **OAuth consent screen** &rarr; Select **External** &rarr; Add your email & test users.
3. **Credentials** &rarr; **+ Create Credentials** &rarr; **OAuth client ID**:
   - Type: `Web application`
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URI: `http://localhost:3000/auth/google/callback`
4. Copy `Client ID` & `Client Secret` to `.env`.

### Discord Developer Portal
1. Visit [Discord Developer Portal](https://discord.com/developers/applications) &rarr; **New Application**.
2. Go to **OAuth2** tab:
   - Under **Redirects**, click **Add Redirect**: `http://localhost:3000/auth/discord/callback`
   - Click **Save Changes**.
3. Copy `Client ID` and click `Reset Secret` to get `Client Secret`.
4. Copy values to `.env`.

---

## 2. Installation

```bash
# 1. Initialize project (ensure "type": "module" in package.json)
npm init -y

# 2. Install required dependencies
npm install express passport passport-google-oauth20 passport-discord jsonwebtoken cookie-parser dotenv
```

### `package.json` Configuration
Make sure your `package.json` contains:
```json
{
  "type": "module",
  "scripts": {
      "start": "node server.js",
   }
}
```

---

## 3. Environment Setup (`.env`)

Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Discord OAuth (from Discord Developer Portal)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
```

---

## 4. Code Breakdown 

- Setup Middleware 

```javascript
// (server.js)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport (No express-session used; session: false)
app.use(passport.initialize());
```

```javascript
// (/middleware/auth.middleware.js)
export function authenticateJWT(req, res, next) {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    if (req.accepts('html')) {
      return res.redirect('/');
    }
    return res.status(401).json({ authenticated: false, message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.clearCookie('token');
    if (req.accepts('html')) {
      return res.redirect('/redirect-to-error-page');
    }
    return res.status(401).json({ authenticated: false, message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}
```

```javascript
// (/utils/jwt.js)
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_EXPIRES_IN = '1d';

export function signToken(payload, expiresIn = DEFAULT_EXPIRES_IN) {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn
    });
  } catch (error) {
    console.error('Error signing JWT token:', error.message);
    throw new Error('Token generation failed');
  }
}

export function verifyToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.warn('JWT verification warning:', error.message);
    return null;
  }
}
```

## 5. Strategies Configuration

- **Google Strategy (`passport-google-oauth20`)**:
  - Scopes: `['profile', 'email']`
  - Returns normalized object: `{ provider: 'google', id, name, email, avatar }`

   ```javascript
   const googleConfig = {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: process.env.GOOGLE_CALLBACK_URL
   };
   ```

   ```javascript
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
   }
   );
   ```


- **Discord Strategy (`passport-discord`)**:
  - Scopes: `['identify', 'email']`
  - Returns normalized object: `{ provider: 'discord', id, name, username, email, avatar }`

   ```javascript
   const discordConfig = {
   clientID: process.env.DISCORD_CLIENT_ID,
   clientSecret: process.env.DISCORD_CLIENT_SECRET,
   callbackURL: process.env.DISCORD_CALLBACK_URL,
   scope: ['identify', 'email']
   };
   ```

   ```javascript
   const discordStrategy = new DiscordStrategy(
   discordConfig,
   (accessToken, refreshToken, profile, done) => {
      const avatarUrl = profile.avatar
         ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
         : 'https://cdn.discordapp.com/embed/avatars/0.png';

      const user = {
         provider: 'discord',
         id: profile.id,
         name: profile.global_name || profile.username || 'Discord User',
         username: profile.username,
         email: profile.email || 'No email shared',
         avatar: avatarUrl
      };
      return done(null, user);
   }
   );

   passport.use(discordStrategy);
   ```


### E. Logout

```javascript
app.get('/api/current-user', authenticateJWT, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
    tokenPreview: req.cookies?.token ? req.cookies.token.substring(0, 20) + '...' : 'Bearer Token'
  });
});

app.get('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});
```

---

## 6. Run

```bash
npm test
```
Server runs on: `http://localhost:3000`
