const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: 1,
      maxlength: 200
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    category: {
      type: String,
      enum: ["College", "Personal", "Work"],
      default: "College"
    },
    dueDate: {
      type: Date,
      default: null
    },
    reminderAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
