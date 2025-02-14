import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from ".";
import { User, IUser } from "../models";
import { UserService } from "../services";


// Initialize the UserService instance
const userService = new UserService();

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "https://spices-server.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          // Create new user if not exists
          user = new User({
            f_name: profile.name.givenName, // Google first name
            l_name: profile.name.familyName, // Google last name
            email: profile.emails[0].value,
            isOAuthUser: true,
          });
          user = await user.save();
        }

        // Generate JWT Token
        // const token = jwt.sign(
        //   {
        //     id: user._id,
        //     role: user.role,
        //     email: user.email,
        //     firstName: user.f_name,
        //     lastName: user.l_name,
        //   },
        //   process.env.JWT_SECRET!,
        //   {
        //     expiresIn: "12h",
        //   }
        // );
  
        // user.set("token", token, { strict: false }); 
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
