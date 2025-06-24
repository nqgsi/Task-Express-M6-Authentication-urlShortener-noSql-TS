import { NextFunction, Request, Response } from "express";
import User from "../../models/User";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (err) {
        next(err);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().populate("urls");
        res.status(201).json(users);
    } catch (err) {
        next(err);
    }
};