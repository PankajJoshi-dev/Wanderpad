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

  newListing.save().then((data) => {
    req.flash("success", "Listing created successfully!");
    return res.redirect("/listings");
  });
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
  if (price) updates.category = category;
  if (location) updates.location = location;
  if (country) updates.country = country;
  if (geometry) updates.geometry = geometry;

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    {
      $set: updates,
    },
    {
      runValidators: true,
      new: true,
    },
  );
  req.flash("success", "Listing updated successfully!");
  return res.redirect(`/listings/${id}`);
});

const search = asyncHandler(async (req, res) => {
  const category = req.query.category?.trim().toLowerCase();
  const location = req.query.location?.trim();

  console.log(`Category: ${category}`)
  console.log(`location: ${location}`)

  if ((!category) && (!location)) {
    return res.redirect("/listings");
  }

  if((!category) && (!location)){
    req.flash("error", `Please provide a valid filter`);
    return res.redirect("/listings");
  }

  let allListings = [];
  if(!category && location) { 
    allListings = await Listing.find({ location: location });
  }
  else if(!location && category) {
    allListings = await Listing.find({ category: category });
  }
  
  if (!allListings || !allListings.length) {
    req.flash("error", `No listings found matching your search.`);
    return res.redirect("/listings");
  }

  req.flash("success", `Search results for ${category}`);
  res.render("templates/listings/index.ejs", { allListings });
});

const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
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
