import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import userRoute from "./routes/user.route.js";
import organisationRoute from "./routes/organisation.route.js";
// import { User, Organisation } from "./models/associations.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/organisations", organisationRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

// Sync models
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
