# WanderPad

A server-rendered travel listing web app where users can search, explore, and review listings with map-based location features. Built with a backend-focused approach and deployed on Render.

## Features

- **Listings:** Create, view, edit, and delete travel listings.
- **Search & Filtering:** Case-insensitive search and category-based filtering.
- **Authentication:** User login and signup using Passport.js.
- **Authorization:** Ownership-based access control for listings and reviews.
- **Reviews:** Users can add and view ratings and reviews.
- **Maps & Geocoding:** Location visualization using Leaflet and geocoding services.
- **Image Uploads:** Listing images uploaded and managed using Cloudinary.
- **Validation & Feedback:** Joi-based validation with flash messages for user feedback.

---

## Tech Stack

### Backend

- **Node.js** & **Express**
- **MongoDB** (Mongoose)
- **Passport.js** (Authentication)
- **Joi** (Validation)
- **Cloudinary** (Image storage)

### Frontend (SSR)

- **EJS** (Templating)
- **Bootstrap** (Styling)
- **Leaflet** (Maps)

### Deployment

- **Backend & Frontend:** Render

---

## Project Structure

```text
/public
  /css           # Stylesheets
  /js            # Client-side scripts

/src
  /config        # App and configuration setup
  /controllers   # Route logic
  /db            # Database connection
  /middlewares   # Authentication, authorization, validation
  /models        # Database schemas
  /routes        # Express routes
  /services      # External services (e.g., geocoding)
  /utils         # Helper functions
  /validations   # Joi validation schemas
  /views         # EJS templates

app.js           # App configuration
server.js        # Server entry point
```

---

## Key Flows

### 1. Authentication

- User signs up or logs in
- Session created using Passport.js
- User stays logged in across requests

### 2. Listings

- Users can create and manage listings
- Only owners can edit or delete their listings

### 3. Reviews

- Users can add reviews to listings
- Only review authors can delete their reviews

### 4. Search & Filtering

- Listings can be searched (case-insensitive)
- Category-based filtering supported

### 5. Maps & Location

- Listings are geocoded into coordinates
- Coordinates are saved in DB
- Locations displayed using Leaflet maps

---

## Running Locally

```bash
git clone https://github.com/PankajJoshi-dev/Wanderpad.git
cd Wanderpad
npm install
npm run dev
```

---

## Environment Setup

Create a `.env` file and add:

```text
NODE_ENV=production/development
MONGODB_URI=your_mongodb_connection
CLOUD_NAME=your_cloudinary_username
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MONGO_STORE_SECRET=your_session_secret
```
