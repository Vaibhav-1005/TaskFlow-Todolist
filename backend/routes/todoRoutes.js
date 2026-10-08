const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const allowedPriorities = ["Low", "Medium", "High"];
    const allowedCategories = ["College", "Personal", "Work"];

    const priority = allowedPriorities.includes(req.body.priority)
      ? req.body.priority
      : "Medium";

    const category = allowedCategories.includes(req.body.category)
      ? req.body.category
      : "College";

    const todo = await Todo.create({
      title,
      priority,
      category,
      dueDate: req.body.dueDate || null,
      reminderAt: req.body.reminderAt || null
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updates = {};

    if (typeof req.body.title === "string") {
      const title = req.body.title.trim();
      if (!title) return res.status(400).json({ message: "Task title is required" });
      updates.title = title;
    }

    if (typeof req.body.completed === "boolean") updates.completed = req.body.completed;

    if (["Low", "Medium", "High"].includes(req.body.priority)) {
      updates.priority = req.body.priority;
    }

    if (["College", "Personal", "Work"].includes(req.body.category)) {
      updates.category = req.body.category;
    }

    if ("dueDate" in req.body) updates.dueDate = req.body.dueDate || null;
    if ("reminderAt" in req.body) updates.reminderAt = req.body.reminderAt || null;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid task id" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Todo.deleteMany({ completed: true });
    res.json({ message: "Completed tasks cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear completed tasks" });
  }
});

module.exports = router;
