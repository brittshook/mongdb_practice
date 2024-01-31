import express from "express";
import dotenv from "dotenv";
import grades from "./routes/grades.mjs";

dotenv.config();
const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/grades", grades);

app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
