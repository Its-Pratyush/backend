const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Note");

//Define your route handelers using router methos like router,get()

// Route 1 : Get all the notes

router.get("/getAllNotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.log(err.nmessage);
    res.status(500).send("Internal server error");
  }
});

// route 2: Add a new note create notes
router.post("/createnote", fetchuser, async (req, res) => {
  const { title, description } = req.body;
  try {
    const note = new Notes({
      title,
      description,
      user: req.user.id,
    });
    const saveNotes = await note.save();
    res.json(saveNotes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server error");
  }
});

//Route 3: update notes POST request

router.put("/updateNote/:id", fetchuser, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    //find the note to be updated
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(400).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (err) {
    console.log(err.nmessage);
    res.status(500).send("Internal server error");
  }
});

// Route 4

router.delete("/deleteNote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(401).send("Not allowed");
    }

    //allow seletion if only user own this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted successfully", note: note });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
