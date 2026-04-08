import Listing from "../models/listing.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import geocode from "../services/geocode.service.js";

const newListing = (req, res) => {
  return res.render("templates/listings/new.ejs");
};

const createListing = asyncHandler(async (req, res) => {
  if (!req.file) {
    req.flash("error", "Image is required.");
    return res.redirect(`/listings/new`);
  }
  const { path: image, filename } = req.file;

  const geometry = await geocode(req.body.location);

  const newListing = new Listing(req.body);
  newListing.image = {
    imageUrl: image,
    filename: filename,
  };
  newListing.owner = req.user._id;
  newListing.geometry = geometry;

  await newListing.save();

  req.flash("success", "Listing created successfully!");
  return res.redirect("/listings");

});

const listingIndex = asyncHandler(async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("templates/listings/index.ejs", { allListings });
});

const showListing = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  return res.render("templates/listings/show.ejs", { listing });
});

const editListing = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  listing.image.imageUrl = listing.image.imageUrl.replace(
    "/upload/",
    "/upload/w_300,h_300,c_fill/",
  );

  return res.render("templates/listings/edit.ejs", { listing });
});

const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, location, country } = req.body;
  const updates = {};
  const geometry = await geocode(req.body.location);

  if (req.file) {
    const { path: image, filename } = req.file;
    if (image && filename) {
      updates.image = {
        imageUrl: image,
        filename: filename,
      };
    }
  }
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (price) updates.price = price;
  if (category) updates.category = category;
  if (location) updates.location = location;
  if (country) updates.country = country;
  if (geometry) updates.geometry = geometry;

  await Listing.findByIdAndUpdate(
    id,
    {
      $set: updates,
    },
    {
      runValidators: true,
    },
  );
  req.flash("success", "Listing updated successfully!");
  return res.redirect(`/listings/${id}`);
});

const search = asyncHandler(async (req, res) => {
  const { category, location } = req.query;

  if (!category && !location) {
    res.locals.error = ["Please enter a category or location to search."];
    return res.render("templates/listings/index.ejs", { allListings: [] });
  }

  const query = {};
  if (location) query.location = location.trim().toLowerCase();
  if (category) query.category = category.trim().toLowerCase();

  const allListings = await Listing.find(query);

  if (!allListings.length) {
    res.locals.error = ["No listings found matching your search."];
    return res.render("templates/listings/index.ejs", { allListings: [] });
  }

  res.locals.success = [`${allListings.length}  results found.`];
  return res.render("templates/listings/index.ejs", { allListings });
});

const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  return res.redirect("/listings");
});

export {
  newListing,
  createListing,
  listingIndex,
  showListing,
  editListing,
  updateListing,
  search,
  deleteListing,
};
