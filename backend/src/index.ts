import "dotenv/config";   // ✅ MUST be first

import express from "express";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat-routes.js";

import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

//connections and listeneres
const PORT = process.env.PORT || 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log("Server Open & Connected To Database 🤟")
    );
  })
  .catch((err) => console.log(err));
