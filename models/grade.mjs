import mongoose from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;

const Grade = model(
  "Grade",
  new Schema({ scores: [], class_id: Number, learner_id: Number })
);

export default Grade;
