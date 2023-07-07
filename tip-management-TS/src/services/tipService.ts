import { JwtPayload } from "jsonwebtoken";
import Place from "../models/tips";
import { IPlace } from "../types/type";

export const createTip = async (
  placeName: string,
  billAmount: number,
  tipAmount: number,
  id: string | JwtPayload | undefined
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
  id: string | JwtPayload | undefined,
  placeName: string
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
          _id: 0,
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
  id: string | JwtPayload | undefined,
  placeName: string
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
          // user: {
          //   $push: {
          //     $mergeObjects: ["$$ROOT"],
          //   },
          // },

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

export const getMostVisited = async (id: string | JwtPayload | undefined) => {
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
