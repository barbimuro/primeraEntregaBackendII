import passport from "passport";
import local from 'passport-local';
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

import { usersService } from "../managers/index.js";
import AuthService from "../services/AuthService.js";
import config from "./config.js";

const LocalStrategy = local.Strategy;

const initializePassportConfig = () => {
    passport.use('register', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
        const { firstName, lastName, age } = req.body;
        if (!firstName || !lastName) {
            return done(null, false, { message: 'Incomplete values' });
        }
        const user = await usersService.getUserByEmail(email);
        if (user) {
            return done(null, false, { message: "User already exists" });
        }
    
        const authService = new AuthService();
        const hashedPassword = await authService.hashPassword(password);
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: hashedPassword,
            cart: [],
            role: 'user'
        };
        const result = await usersService.createUser(newUser);
        return done(null, result);
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: "Incorrect credentials" });
        }
        const authService = new AuthService();
        const isValidPassword = await authService.validatePassword(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: "Incorrect credentials" });
        }
    
        return done(null, user);
    }));

    passport.use('github', new GithubStrategy({
        clientID: config.auth.github.CLIENT_ID,
        clientSecret: config.auth.github.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (token, refreshToken, profile, done) => {
        const userInfo = profile._json;
        if (!userInfo) {
            return done(null, false, { message: "Error login" });
        }
        let user = await usersService.getUserByEmail(userInfo.email);
        if (user) {
            return done(null, user);
        }
        const newUser = {
            firstName: userInfo.name.split(' ')[0],
            lastName: userInfo.name.split(' ')[1],
            password: '',
            email: userInfo.email,
            cart: [],
            role: 'user'
        };
        const result = await usersService.createUser(newUser);
        return done(null, result);
    }));

    passport.use('current', new JWTStrategy({
        secretOrKey: config.auth.jwt.SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
    }, async (payload, done) => {
        return done(null, payload);
    }));
    
    function cookieExtractor(req) {
        return req?.cookies?.[config.auth.jwt.COOKIE];
    }
};

export default initializePassportConfig;
