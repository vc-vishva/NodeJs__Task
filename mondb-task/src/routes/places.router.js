import express from "express";
import client from "../db/connection.js";
import verifyToken from "../../authentication.js";

const placesRouter = express.Router();
const db = client.db("users");

//get all places

placesRouter.get("/", async (req, res) => {
  try {

    const getPlaces = await db.collection("places").find().toArray();
    
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

    if (userId !== decodedUserId) {
      return res.status(401).send({ message: "Invalid userId." });
    }

    const newPlace = {
      placeName: placeName,
      billAmount: billAmount,
      tipAmount: tipAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
      user_id: userId,
    };

    const savePlace = await db.collection("places").insertOne(newPlace);
    res
      .status(200)
      .send({ status: 200, message: "Successfully", data: newPlace });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ status: 500, error: "Internal server error" });
  }
});

// find list of tips

placesRouter.get("/tips", verifyToken, async (req, res) => {
  try {
    const { placeName } = req.body;

    const userId = req.body.id;
    const decodedUserId = req.userId;

    if (userId !== decodedUserId) {
      return res.status(401).send({ message: "Invalid userId." });
    }

    const getTotal = await db
      .collection("places")
      .find(
        { user_id: userId, placeName: placeName },
        { totalAmount: { $sum: ["$billAmount", "$tipAmount"] } }
      )
      .toArray();
<<<<<<< HEAD
    let totalAmount = 0;

    for (let i = 0; i < getTotal.length; i++) {
      const { billAmount, tipAmount } = getTotal[i];
      totalAmount += billAmount + tipAmount;
    }

    res
      .status(200)
      .send({ status: 200, message: "sucess", user: getTotal, totalAmount });
=======
      let totalAmount = 0;

      for (let i = 0; i < getTotal.length; i++) {
        const { billAmount, tipAmount } = getTotal[i];
        totalAmount += billAmount + tipAmount;
      }
    // let sum = 0;

    // for (let value of getTotal) {
    //   sum = value.billAmount + value.tipAmount;
    // }
    // "Sum: " + sum;

    res.status(200).send({ status: 200, message: "sucess", user: getTotal, totalAmount });
>>>>>>> 3c8f244de12a71413ba87510c1683146ea6865b4
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ status: 500, message: "internal server error" });
  }
});

// get repeated  tips percent

placesRouter.get("/place", verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    const decodedUserId = req.userId;

    if (userId !== decodedUserId) {
      return res.status(401).send({ message: "Invalid userId." });
    }

    // const userId = new ObjectId(req.body.userId);
    const placeName = req.body.placeName;

    const percentages = await db
      .collection("places")
      .find(
        { user_id: userId, placeName: placeName },
        {
          projection: {
            percent: {
              $multiply: [{ $divide: ["$tipAmount", "$billAmount"] }, 100],
            },
          },
        }
      )
      .toArray();
<<<<<<< HEAD
    const countObj = {};
    let maxRepeatedPercentage = null;
    let maxRepeatedCount = 0;

    for (let i = 0; i < percentages.length; i++) {
      const currentPercent = percentages[i].percent;
      const count = countObj[currentPercent] || 0;
      const updatedCount = count + 1;
      countObj[currentPercent] = updatedCount;
=======
    // const countMap = new Map();
    // let maxRepeatedPercentage = null;
    // let maxRepeatedCount = 0;

    // for (let i = 0; i < percentages.length; i++) {
    //   const currentPercent = percentages[i].percent;
    //   const count = countMap.get(currentPercent) || 0;
    //   const updatedCount = count + 1;
    //   countMap.set(currentPercent, updatedCount);

    //   if (updatedCount > maxRepeatedCount) {
    //     maxRepeatedCount = updatedCount;
    //     maxRepeatedPercentage = currentPercent;
    //   }
    // }
    const countObj = {};
let maxRepeatedPercentage = null;
let maxRepeatedCount = 0;

for (let i = 0; i < percentages.length; i++) {
  const currentPercent = percentages[i].percent;
  const count = countObj[currentPercent] || 0;
  const updatedCount = count + 1;
  countObj[currentPercent] = updatedCount;

  if (updatedCount > maxRepeatedCount) {
    maxRepeatedCount = updatedCount;
    maxRepeatedPercentage = currentPercent;
  }
}
>>>>>>> 3c8f244de12a71413ba87510c1683146ea6865b4


    res.send({ data: percentages, maxRepeatedPercentage });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// most  visit place
placesRouter.get("/mostVisited", verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId;

    const places = await db
      .collection("places")
      .find({ user_id: userId })
      .toArray();

    // Count the occurrences of each place
    const placeCounts = {};
    for (let place of places) {
      const placeName = place.placeName;
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
    const highestPlace = sortedPlaces[0];

    res
      .status(200)
      .send({ status: 200, message: "success", data: highestPlace });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Internal server error" });
  }
});

export default placesRouter;
