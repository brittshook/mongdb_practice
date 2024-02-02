import express from "express";
import Grade from "../models/grade.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await Grade.find().limit(1000);
  res.status(200).json({ learners: result });
});

router.post("/", async (req, res) => {
  let newDocument = req.body;

  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }

  const result = new Grade(newDocument);
  res.status(201).json({ grades: result });
});

router.get("/:id", async (req, res) => {
  const objId = req.params.id;
  const result = await Grade.findById(objId);

  if (!result) res.json({ error: { error: "Not found" } }).status(404);
  else res.status(200).json({ grades: result });
});

router.patch("/:id/add", async (req, res) => {
  const objId = req.params.id;
  const result = await Grade.findByIdAndUpdate(objId, {
    $push: { scores: req.body },
  });
  const updatedEntry = await Grade.findById(objId);

  if (!result || result.acknowledged == false)
    res.json({ error: "Not found" }).status(404);
  else res.status(200).json({ grades: updatedEntry });
});

router.patch("/:id/remove", async (req, res) => {
  const objId = req.params.id;
  let result = await Grade.findByIdAndUpdate(objId, {
    $pull: { scores: req.body },
  });
  const updatedEntry = await Grade.findById(objId);

  if (!result || result.acknowledged == false)
    res.json({ error: "Not found" }).status(404);
  else res.status(200).json({ grades: updatedEntry });
});

router.delete("/:id", async (req, res) => {
  const objId = req.params.id;
  let result = await Grade.findByIdAndDelete(objId);

  if (!result || result.deletedCount == 0)
    res.json({ error: "Not found" }).status(404);
  else res.status(204).json();
});

router.get("/student/:id", async (req, res) => {
  res.redirect(`../learner/${req.params.id}`);
});

router.get("/learner/:id", async (req, res) => {
  const learnerId = req.params.id;
  let query = { learner_id: Number(learnerId) };

  if (req.query.class) query.class_id = Number(req.query.class);

  let result = await Grade.find(query);

  if (!result) res.json({ error: "Not found" }).status(404);
  else res.status(200).json({ grades: result });
});

router.delete("/learner/:id", async (req, res) => {
  const learnerId = req.params.id;

  let result = await Grade.findOneAndDelete({ learner_id: Number(learnerId) });

  if (!result || result.deletedCount == 0)
    res.json({ error: "Not found" }).status(404);
  else res.status(204).json();
});

router.get("/class/:id", async (req, res) => {
  const classId = req.params.id;
  let query = { class_id: Number(classId) };

  if (req.query.learner) query.learner_id = Number(req.query.learner);

  let result = await Grade.find(query);

  if (!result) res.json({ error: "Not found" }).status(404);
  else res.status(200).json({ grades: result });
});

router.patch("/class/:id", async (req, res) => {
  const classId = req.params.id;
  const newClassId = req.body.id;

  let result = await Grade.updateMany(
    { class_id: Number(classId) },
    {
      $set: { class_id: newClassId },
    }
  );
  const updatedEntries = await Grade.find({
    class_id: Number(newClassId),
  });

  if (!result || result.acknowledged == false)
    res.json({ error: "Not found" }).status(404);
  else res.status(200).json({ grades: updatedEntries });
});

router.delete("/class/:id", async (req, res) => {
  const classId = req.params.id;

  let result = await Grade.deleteMany({ class_id: Number(classId) });

  if (!result || result.deletedCount == 0)
    res.json({ error: "Not found" }).status(404);
  else res.status(204).json();
});

export default router;
