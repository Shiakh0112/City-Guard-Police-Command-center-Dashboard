const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://city-guard-police-command-center-da.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.use("/api/auth",      require("./routes/auth"));
app.use("/api/incidents", require("./routes/incidents"));
app.use("/api/officers",  require("./routes/officers"));
app.use("/api/admin",     require("./routes/admin"));

app.get("/", (req, res) => res.json({ message: "City Guard API ✅" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });
