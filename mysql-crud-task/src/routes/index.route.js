import express from "express";
import userRoutes from "./user.route.js";
import permissionRoutes from "./permission.route.js";
import roleRoutes from "./role.route.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/role", roleRoutes);
router.use("/permission", permissionRoutes);

export default router;
