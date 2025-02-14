"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const _1 = require(".");
const models_1 = require("../models");
const services_1 = require("../services");
// Initialize the UserService instance
const userService = new services_1.UserService();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: _1.config.GOOGLE_CLIENT_ID,
    clientSecret: _1.config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let user = yield models_1.User.findOne({ email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value });
        if (!user) {
            // Create new user if not exists
            user = new models_1.User({
                f_name: profile.name.givenName, // Google first name
                l_name: profile.name.familyName, // Google last name
                email: profile.emails[0].value,
                isOAuthUser: true,
            });
            user = yield user.save();
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
    }
    catch (error) {
        return done(error, null);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map