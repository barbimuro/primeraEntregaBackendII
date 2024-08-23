import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { usersService } from "../managers/index.js";
import AuthService from "../services/AuthService.js";
import config from "../config/config.js";

const sessionsRouter = Router();

sessionsRouter.post('/register', (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {
        if (err) {
            console.error('Registration error:', err);
            return next(err);
        }
        if (!user) {
            return res.status(400).send({ status: "error", error: "User already exists" });
        }

        const userSession = { 
            id: user._id,
            name: user.firstName,
            role: user.role
        };
        const userToken = jwt.sign(userSession, config.auth.jwt.SECRET, { expiresIn: "1d" });
        console.log('Setting cookie with token:', userToken);
        res.cookie(config.auth.jwt.COOKIE, userToken, { httpOnly: true }).redirect('/profile');
    })(req, res, next);
});


sessionsRouter.post('/login', (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        if (err) {
            console.error('Login error:', err);
            return next(err);
        }
        if (!user) {
            return res.status(400).send({ status: "error", error: "Incorrect credentials" });
        }

        
        const userSession = { 
            id: user._id,
            name: user.firstName,
            role: user.role
        };
        const userToken = jwt.sign(userSession, config.auth.jwt.SECRET, { expiresIn: "1d" });
        res.cookie(config.auth.jwt.COOKIE, userToken).redirect('/profile');
    })(req, res, next);
});


sessionsRouter.get('/failureLogin', (req, res) => {
    res.send({ status: "error", error: "Failed login attempts" });
});

sessionsRouter.get('/github', passport.authenticate('github'));

sessionsRouter.get('/githubcallback', passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    const userSession = { 
            name:`${req.user.firstName} ${req.user.lastName}`,
            role:req.user.role,
            id:req.user._id
    };
    const userToken = jwt.sign(userSession, config.auth.jwt.SECRET, { expiresIn: "1d" });
    res.cookie(config.auth.jwt.COOKIE, userToken).redirect('/profile');
    console.log(userToken); 

});

sessionsRouter.get('/current', (req, res) => {
    const token = req.cookies[config.auth.jwt.COOKIE];
    if (!token) {
        return res.status(401).send({ status: "error", error: "Please log in" });
    }
    try {
        const user = jwt.verify(token, config.auth.jwt.SECRET);
        res.send(user);
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).send({ status: "error", error: "Invalid token" });
    }
});


sessionsRouter.get('/logout', (req, res) => {
    res.clearCookie(config.auth.jwt.COOKIE).redirect('/login');
});

export default sessionsRouter;
