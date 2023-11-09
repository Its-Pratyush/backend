const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Todo = require("../models/Todo");

//Define your route handelers using router methos like router,get()

// Route 1 : Get all the notes

router.get("/getAlltodos", fetchuser, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    console.log(err.nmessage);
    res.status(500).send("Internal server error");
  }
});

// route 2: Add a new note create notes
router.post("/createtodo", fetchuser, async (req, res) => {
  const { title, description } = req.body;
  try {
    const todo = new Todo({
      title,
      description,
      user: req.user.id,
    });
    const saveTodos = await todo.save();
    res.json(saveTodos);
  } catch (err) {
    console.log(err.nmessage);
    res.status(500).send("Internal server error");
  }
});

//Route 3: update notes POST request

router.put("/updateTodo/:id", fetchuser, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = {};
    if (title) {
      newTodo.title = title;
    }
    if (description) {
      newTodo.description = description;
    }
    //find the note to be updated
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(400).send("Not found");
    }
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: newTodo },
      { new: true }
    );
    res.json({ todo });
  } catch (err) {
    console.log(err.nmessage);
    res.status(500).send("Internal server error");
  }
});

// Route 4

router.delete("/deleteTodo/:id", fetchuser, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(401).send("Not allowed");
    }

    //allow seletion if only user own this note
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    todo = await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted successfully", todo: todo });
  } catch (err) {
    console.log(err.nmessage);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
