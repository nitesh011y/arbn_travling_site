const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const Listing = require("./model/listing.js");

const app = express();
const port = 3000;

/** ======================
 * Middleware and Config
 ======================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/** ======================
 * Database Connection
 ======================== */
const mongo_url = "mongodb://127.0.0.1:27017/travel";
async function connectDB() {
  try {
    await mongoose.connect(mongo_url);  
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
connectDB();

/** ======================
 * Routes
 ======================== */

// Home Route
app.get("/", (req, res) => {
  res.send("Hello, welcome to the Travel App!");
});

/** ===== Listings Routes ===== */

// New Listing Form Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Index Route: Show all listings
app.get("/listings", async (req, res) => {
  try {
    const all_listings = await Listing.find({});
    res.render("listings/index.ejs", { all_listings });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving listings.");
  }
});

// Show Route: Display a specific listing
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found!");
    }

    res.render("listings/show.ejs", { listing });
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid ID format.");
  }
});

// Create Route: Add a new listing
app.post("/listings", async (req, res) => {
  try {
    const { title, description, price, country, location } = req.body;
    const newListing = new Listing({ title, description, price, country, location });
    await newListing.save();

    console.log("New listing added:", newListing);
    res.redirect("/listings");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating the listing.");
  }
});

// Edit Route: Render edit form for a listing
app.get("/listings/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found!");
    }

    res.render("listings/edit.ejs", { listing });
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid ID format.");
  }
});

// Update Route: Save changes to a listing
app.put("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, country, location } = req.body;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { title, description, price, country, location },
      { new: true, runValidators: true }
    );

    console.log("Updated listing:", updatedListing);
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the listing.");
  }
});

// Delete Route: Remove a listing
app.delete("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    console.log(`Deleted listing with ID: ${id}`);
    res.redirect("/listings");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the listing.");
  }
});

/** ======================
 * Server
 ======================== */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
