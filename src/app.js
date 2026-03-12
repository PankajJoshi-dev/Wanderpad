import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Because ES module does not support __dirname and __filename
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import { showFlash } from "./middlewares/flash.middleware.js";
import User from "./models/user.model.js";
import passport from "passport";
import LocalStrategy from "passport-local";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  crypto : {
    secret : "MySuperSecretCode"
  },
  touchAfter: 24*3600
});

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE", err);
})

const sessionOptions = {
  store,
  secret: "MySuperSecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(showFlash);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

import { listingRouter } from "./routes/listing.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
