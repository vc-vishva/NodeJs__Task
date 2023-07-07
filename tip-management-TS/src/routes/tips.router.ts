import { Router } from "express";
import { validatePlace } from "../validation/tipValidation";

import authMiddleware from "../middleware/verify";
import * as tipController from "../controller/tipController";

const tipsRoutes = Router();

tipsRoutes.post("/", validatePlace, authMiddleware, tipController.addTips);
tipsRoutes.get("/", authMiddleware, tipController.tipList);
tipsRoutes.get("/place", authMiddleware, tipController.repeatedTip);
tipsRoutes.get("/visit", authMiddleware, tipController.mostVisited);

export default tipsRoutes;
