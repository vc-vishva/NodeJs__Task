import express from "express";
import userRouter from "./user.route.js";
import permissionRouter from "./permission.route.js";
import roleRouter from "./role.route.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/role", roleRouter);
router.use("/permission", permissionRouter);

export default router;
