import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User", // Who is subscribing
    },
    channel: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // To whom is subscribing
      },
    ],
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
