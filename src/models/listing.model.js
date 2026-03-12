import mongoose from "mongoose";
import Review from "./review.model.js";
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    imageUrl: {
      type: String,
      required: true,
    },
    filename: String,
  },
  category: String,
  price: Number,
  location: String,
  geometry: {
    type: {
      type: String, // <-- Mongoose type
      enum: ["Point"], // <-- allowed value
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
    },
  },
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (deletedListing) => {
  if (deletedListing) {
    await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
