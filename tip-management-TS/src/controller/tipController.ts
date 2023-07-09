import Place from "../models/tips";
import * as tipsService from "../services/tipService";
import { Express, NextFunction, Request, Response } from "express";
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

    res.status(201).send({ message: "Tip created successfully", data: newTip });
  } catch (error) {
    res.status(500).send({ error: "Failed to create tip" });
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

    console.log("tipList: ", tipList);

    res.status(200).json(tipList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
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

    res.status(200).json(repeatedTips);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// most visited place

export const mostVisited = async (req: Request & test, res: Response) => {
  try {
    const userId = req.id;

    const mostVisited = await tipsService.getMostVisited(userId);

    res.status(200).json(mostVisited);
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
