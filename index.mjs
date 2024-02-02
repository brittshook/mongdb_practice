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
  console.log(err);
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
