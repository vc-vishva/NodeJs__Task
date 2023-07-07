import express from "express";

import userRoutes from "./user.router";
import tipsRoutes from "./tips.router";

const router = express.Router();
router.use("/user", userRoutes);
router.use("/tips", tipsRoutes);
export default router;
