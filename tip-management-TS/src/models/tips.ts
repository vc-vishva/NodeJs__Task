import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface IPlace extends Document {
  placeName: string;
  billAmount: number;
  tipAmount: number;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
}

const placeSchema: Schema<IPlace> = new Schema(
  {
    placeName: { type: String, required: true },
    billAmount: { type: Number, required: true },
    tipAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    user_id: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
  },
  { collection: "places" }
);

const Place = mongoose.model<IPlace>("Place", placeSchema);

export default Place;
