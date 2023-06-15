import express from "express";
import client from "../db/connection.js";
import { verifyToken } from "./jwt.router.js";

const placesRouter = express.Router();

const db = client.db("users");
import { ObjectId } from "mongodb";

//get all places

placesRouter.get("/", async (req, res) => {
  try {
    const getPlaces = await db.collection("places").find().toArray();
    // const users = await Promise.all([...getPlaces.map((user) => user)]);

    res.status(200).send({ status: 200, data: getPlaces });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
});

//post
placesRouter.post("/", verifyToken, async (req, res) => {
  try {
    const { placeName, billAmount, tipAmount, id } = req.body;
    const userId = req.body.id;
    const decodedUserId = req.userId;
    console.log(decodedUserId, "============", userId);

    if (userId !== decodedUserId) {
      return res.status(401).send({ message: "Invalid userId." });
    }

    const newPlace = {
      placeNmane: placeName,
      billAmount: billAmount,
      tipAmount: tipAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
      user_id: userId,
    };

    console.log("Token userId:", req.userId);
    console.log("New place:", newPlace);
    const savePlace = await db.collection("places").insertOne(newPlace);
    res
      .status(200)
      .send({ status: 200, message: "Successfully", data: newPlace });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, error: "Internal server error" });
  }
});

//find list of tips****************************************************************************

placesRouter.get("/tips", verifyToken, async (req, res) => {
  try {
    const { placeNmane } = req.body;

    const userId = req.body.id;
    const decodedUserId = req.userId;
    console.log(decodedUserId, "============", userId);

    if (userId !== decodedUserId) {
      return res.status(401).send({ message: "Invalid userId." });
    }

    console.log("userId", userId);
    console.log("placename", placeNmane);
    // const user = { user_id: userId, placeNmane: placeNmane };

    const getTotal = await db
      .collection("places")
      .find(
        { user_id: userId, placeNmane: placeNmane },
        { totalAmount: { $sum: ["$billAmount", "$tipAmount"] } }
      )
      .toArray();

    let sum = 0;

    for (let value of getTotal) {
      sum += value.billAmount + value.tipAmount;
    }
    "Sum: " + sum;

    // console.log("=============", totalAmount);
    res.status(200).send({ status: 200, message: "sucess", user: userId, sum });
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ status: 500, message: "internal server error" });
  }
});

///6*****************************************************************************

placesRouter.get("/place", verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    const decodedUserId = req.userId;
    console.log(decodedUserId, "============", userId);

    if (userId !== decodedUserId) {
      return res.status(401).send({ message: "Invalid userId." });
    }

    // const userId = new ObjectId(req.body.userId);
    const placeName = req.body.placeName;

    const percentages = await db
      .collection("places")
      .find(
        { user_id: userId, placeNmane: placeName },
        {
          projection: {
            percent: {
              $multiply: [{ $divide: ["$tipAmount", "$billAmount"] }, 100],
            },
          },
        }
      )
      .toArray();
    const countMap = new Map();
    let maxRepeatedPercentage = null;
    let maxRepeatedCount = 0;

    for (let i = 0; i < percentages.length; i++) {
      const currentPercent = percentages[i].percent;
      const count = countMap.get(currentPercent) || 0;
      const updatedCount = count + 1;
      countMap.set(currentPercent, updatedCount);

      if (updatedCount > maxRepeatedCount) {
        maxRepeatedCount = updatedCount;
        maxRepeatedPercentage = currentPercent;
      }
    }

    console.log(maxRepeatedPercentage);
    res.send({ data: percentages, maxRepeatedPercentage });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// most  visite place **********************************************
placesRouter.get("/mostVisited", verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    const decodedUserId = req.userId;
    console.log(decodedUserId, "============", userId);

    if (userId !== decodedUserId) {
      return res.status(401).send({ message: "Invalid userId." });
    }

    // const { userId } = req.body;

    const places = await db
      .collection("places")
      .find({ user_id: userId })
      .toArray();

    // Count the occurrences of each place
    const placeCounts = {};
    for (let place of places) {
      const placeName = place.placeNmane;
      if (placeCounts[placeName]) {
        placeCounts[placeName]++;
      } else {
        placeCounts[placeName] = 1;
      }
    }

    // Sort the places by visit count
    const sortedPlaces = Object.keys(placeCounts).sort(
      (a, b) => placeCounts[b] - placeCounts[a]
    );

    res
      .status(200)
      .send({ status: 200, message: "success", data: sortedPlaces });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Internal server error" });
  }
});

export default placesRouter;
