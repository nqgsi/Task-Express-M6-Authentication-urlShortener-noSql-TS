import Url from "../../models/Url";
import shortid from "shortid";
import User from "../../models/User";
import { NextFunction, Request, Response } from "express";

const baseUrl = "http://localhost:8000/api/urls";

export const shorten = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const urlCode = shortid.generate();
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newUrl = await Url.create({
      ...req.body,
      urlCode,
      shortUrl: `${baseUrl}/${urlCode}`,
      userId: req.user._id,
    });
    console.log(newUrl);
    await User.findByIdAndUpdate(req.user._id, {
      $push: { urls: newUrl._id },
    });

    res.status(201).json(newUrl);
  } catch (err) {
    next(err);
  }
};

export const redirect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      res.redirect(url.longUrl || "");
      return;
    }

    res.status(404).json("No URL Found");
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const url = await Url.findOne({ urlCode: req.params.code });
    if (!url) {
      res.status(404).json("No URL Found");
      return;
    }
    console.log(url);
    console.log(req.user.id);
    if (!url.userId || !url.userId.equals(req.user.id)) {
      return res.status(403).json("You are not authorized to delete this URL");
    }

    await Url.findByIdAndDelete(url._id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { urls: url._id },
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
