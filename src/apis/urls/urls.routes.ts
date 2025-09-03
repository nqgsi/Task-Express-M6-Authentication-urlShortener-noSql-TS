import express, { RequestHandler } from "express";

const router = express.Router();

import { shorten, redirect, deleteUrl } from "./urls.controllers";
import { authorize } from "../../middlewares/authorization";

router.post("/shorten", authorize, shorten);
router.get("/:code", redirect);
router.delete("/:code", authorize, deleteUrl as RequestHandler);

export default router;
