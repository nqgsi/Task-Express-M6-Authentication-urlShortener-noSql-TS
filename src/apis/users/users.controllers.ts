import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const saltound = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltound);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { username: newUser.username, _id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    const { password, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (!user.password) {
      res.status(500).json({ message: "User has no password set" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
