import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import Place from "../models/tips";
const { ObjectId } = mongoose.Types;

import { IPlace } from "../types/type";
import { test } from "node:test";

export const createTip = async (
  placeName: string,
  billAmount: number,
  tipAmount: number,
  id?: string | JwtPayload
) => {
  const newPlace = new Place({
    placeName: placeName,
    billAmount: billAmount,
    tipAmount: tipAmount,
    createdAt: new Date(),
    updatedAt: new Date(),
    user_id: id,
  });

  await newPlace.save();

  return newPlace;
};

export const getTipList = async (
  placeName: string,
  id?: string | JwtPayload
) => {
  try {
    const tipList = await Place.aggregate([
      {
        $match: { user_id: id, placeName: placeName },
      },
      {
        $addFields: { totalAmount: { $add: ["$billAmount", "$tipAmount"] } },
      },
      {
        $group: {
          user: {
            $push: {
              $mergeObjects: ["$$ROOT"],
            },
          },
          _id: 1,
          total: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return tipList;
  } catch (error) {
    throw new Error("Failed to retrieve tip list");
  }
};
export const getRepeatedTips = async (
  placeName: string,
  id?: string | JwtPayload
) => {
  try {
    const repeatedTips = await Place.aggregate([
      {
        $match: { user_id: id, placeName: placeName },
      },
      {
        $addFields: {
          percent: {
            $multiply: [{ $divide: ["$tipAmount", "$billAmount"] }, 100],
          },
        },
      },

      {
        $group: {
          _id: "$percent",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          Percent: "$_id",
          count: 1,
          _id: 0,
          userId: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    return repeatedTips;
  } catch (error) {
    throw new Error("Failed to retrieve repeated tips");
  }
};

export const getMostVisited = async (id?: string | JwtPayload) => {
  try {
    const mostVisited = await Place.aggregate([
      {
        $match: { user_id: id },
      },
      {
        $group: {
          user: {
            $push: {
              $mergeObjects: ["$$ROOT"],
            },
          },
          _id: "$placeName",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          Place: "$_id",
          count: 1,
          _id: 0,
          userId: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    return mostVisited;
  } catch (error) {
    throw new Error("Failed to retrieve most visited places");
  }
};
