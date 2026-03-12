import { Router } from "express";
import { joiListingSchema } from "../validations/validator.js";
import { validate } from "../middlewares/validate.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { listingOwner } from "../middlewares/auth.middlewares.js";
import {
  newListing,
  createListing,
  listingIndex,
  showListing,
  editListing,
  updateListing,
  getListingsByCategory,
  deleteListing,
} from "../controllers/listing.controllers.js";
import multer from "multer";
import { storage } from "../config/cloud.config.js";
const upload = multer({ storage });

const listingRouter = Router();

// Render create listing form:
listingRouter.route("/new").get(isLoggedIn, newListing);

// Index and Create Route:
listingRouter
  .route("/")
  .get(listingIndex)
  .post(
    isLoggedIn,
    upload.single("listing-image"),
    validate(joiListingSchema, "body"),
    createListing,
  );

// Render Edit Form:
listingRouter.route("/:id/edit").get(isLoggedIn, listingOwner, editListing);

listingRouter.route("/category").get(getListingsByCategory);

// Show, Update and Destroy Route
listingRouter
  .route("/:id")
  .get(showListing)
  .patch(
    isLoggedIn,
    listingOwner,
    upload.single("listing-image"),
    validate(joiListingSchema, "body"),
    updateListing,
  )
  .delete(isLoggedIn, listingOwner, deleteListing);

export { listingRouter };
