const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a task
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            user: req.user.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        console.error("Create task error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Get current user's tasks
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            tasks
        });
    } catch (error) {
        console.error("Get tasks error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Update current user's task
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description, completed, dueDate } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            {
                title,
                description,
                completed,
                dueDate
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        console.error("Update task error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Delete current user's task
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error("Delete task error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;