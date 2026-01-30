const router = require("express").Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  res.json(await Todo.find({ userId: req.user.id }));
});

router.post("/", auth, async (req, res) => {
  res.json(await Todo.create({
    text: req.body.text,
    userId: req.user.id
  }));
});

router.delete("/:id", auth, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
