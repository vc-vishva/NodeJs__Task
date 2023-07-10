import Place from "../models/tips";
import * as tipsService from "../services/tipService";
import { Express, NextFunction, Request, Response } from "express";
import apiResponse from "../utils/response";

import { test } from "../middleware/verify";

// add new tip

export const addTips = async (
  req: Request & test,
  res: Response,
  next: NextFunction
) => {
  try {
    const { placeName, billAmount, tipAmount } = req.body;
    const id = req.id;

    const newTip = await tipsService.createTip(
      placeName,
      billAmount,
      tipAmount,
      id
    );

    apiResponse(res, 200, "Tip created successfully", newTip);
  } catch (error) {
    apiResponse(res, 500, "Failed to create tip", [], [error]);
  }
};

// find list of tips

export const tipList = async (
  req: Request & test,
  res: Response,
  next: NextFunction
) => {
  try {
    const { placeName } = req.body;
    const id = req.id;

    const tipList = await tipsService.getTipList(placeName, id);

    apiResponse(res, 200, " get Tip list successfully", tipList);
  } catch (error) {
    apiResponse(res, 500, "Failed to get tip list ", [], [error]);
  }
};

//get repeated tips percent

export const repeatedTip = async (
  req: Request & test,
  res: Response,
  next: NextFunction
) => {
  try {
    const placeName = req.body.placeName;
    const id = req.id;

    const repeatedTips = await tipsService.getRepeatedTips(placeName, id);

    apiResponse(res, 200, " get repeatedTips successfully", repeatedTips);
  } catch (error) {
    apiResponse(res, 500, "Failed to get repeatedTips");
  }
};

// most visited place

export const mostVisited = async (req: Request & test, res: Response) => {
  try {
    const userId = req.id;

    const mostVisited = await tipsService.getMostVisited(userId);

    apiResponse(res, 200, " get repeatedTips successfully", mostVisited);
  } catch (error) {
    apiResponse(res, 500, "Failed to get mostVisited");
  }
};
